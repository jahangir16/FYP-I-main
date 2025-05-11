import { Document, Model } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

export async function generateLast12MothsData<T extends Document>(
  model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
  const last12Months: MonthData[] = [];
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Normalize the current date to the start of the day

  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(currentDate);
    endDate.setMonth(currentDate.getMonth() - i); // Move back by 'i' months

    const startDate = new Date(endDate);
    startDate.setMonth(endDate.getMonth() - 1); // Move back by 1 month from the end date

    const monthYear = endDate.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    try {
      const count = await model.countDocuments({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });
      last12Months.push({ month: monthYear, count });
    } catch (error) {
      console.error(`Error fetching data for ${monthYear}:`, error);
      last12Months.push({ month: monthYear, count: 0 }); // Push 0 if there's an error
    }
  }

  return { last12Months };
}
