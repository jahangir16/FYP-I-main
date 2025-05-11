import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import userModel from "../models/user.model";
import ejs from "ejs";
import path from "path";
import puppeteer from "puppeteer";
import SendMailWithAttachments from "../utils/sendMailWithAttachment";
import { Types } from "mongoose";

// Generate certificate using EJS template and send it via email
export const generateCertificate = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = req.body;
      const { userName, courseName, issueDate, courseLevel, userId } = data;

      if (!userId) {
        return next(new ErrorHandler("User ID is missing", 400));
      }

      // Convert userId to ObjectId and find the user
      const user = await userModel.findById(new Types.ObjectId(userId));
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      // Render the EJS template for the certificate
      const templatePath = path.join(
        __dirname,
        "../certificates/Template_1.ejs"
      );
      const html: string = await ejs.renderFile(templatePath, {
        user: userName,
        course: courseName,
        date: issueDate,
        level: courseLevel,
      });

      // Launch Puppeteer and generate PDF
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdfBuffer: Buffer = Buffer.from(await page.pdf({ format: "A4" }));

      // Close the browser
      await browser.close();

      // Render the email template
      const emailTemplatePath = path.join(
        __dirname,
        "../mails/certificateEmail.ejs"
      );
      const emailHtml: string = await ejs.renderFile(emailTemplatePath, {
        user: userName,
        course: courseName,
      });

      // Prepare email options
      const emailOptions = {
        email: user.email,
        subject: `Certificate for ${courseName}`,
        template: "certificateEmail.ejs", // Name of the email template file
        data: {
          user: userName,
          course: courseName,
        },
        attachments: [
          {
            filename: "certificate.pdf",
            content: pdfBuffer,
          },
        ],
      };

      // Send the email using the sendMail utility
      await SendMailWithAttachments(emailOptions);

      // Send the PDF as a response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=certificate.pdf`
      );
      res.send(pdfBuffer);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
