import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Card, CardContent } from "@/app/components/ui/card";
import FormatQuote from "@mui/icons-material/FormatQuote";

type ReviewProps = {
  item: {
    name: string;
    avatar: string;
    profession: string;
    comment: string;
  };
};

const ReviewCard = ({ item }: ReviewProps) => {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      <CardContent className="p-10">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12 border-2 border-blue-100 dark:border-blue-900">
            <AvatarImage src={item.avatar} alt={item.name} />
            <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.profession}
                </p>
              </div>
              <FormatQuote className="h-6 w-6 text-blue-500 dark:text-blue-400 opacity-50" />{" "}
              {/* Replaced with MUI icon */}
            </div>
            <div className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {item.comment.length > 200
                ? `${item.comment.substring(0, 200)}...`
                : item.comment}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
