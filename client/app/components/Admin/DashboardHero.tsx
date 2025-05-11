"use client";
import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardWidgets from "../../components/Admin/Widgets/DashboardWidgets";

type Props = {
  isDashboard?: boolean;
};

const DashboardHero = ({ isDashboard }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <DashboardHeader open={open} setOpen={setOpen} />
      {/* Only render DashboardWidgets if it's not being rendered by the parent */}
      {isDashboard && false && (
        <div className="mt-16 pt-4">
          <DashboardWidgets open={open} />
        </div>
      )}
    </div>
  );
};

export default DashboardHero;
