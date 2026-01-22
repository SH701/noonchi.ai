import { Button } from "@/components/ui/button";

export default function Main() {
  return (
    <div className="flex flex-col flex-1">
      <div className="pt-6">
        <div className="flex flex-col gap-3">
          <span className="text-3xl font-medium">
            Not sure how <br /> this mught sound?
          </span>
          <span className="text-gray-600">
            I`ll help you understand how it sounds <br />
            in Korean
          </span>
        </div>
      </div>
      <div className="mt-auto pb-13">
        {/* onClick으로 ask 채팅 시작 */}
        <Button variant="primary" size="lg">
          Check how is sounds
        </Button>
      </div>
    </div>
  );
}
