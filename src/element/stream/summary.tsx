import { Text } from "../text";

export function StreamSummary({ text }: { text: string }) {
  return (
    <div className="whitespace-pre text-pretty">
      <Text content={text} tags={[]} />
    </div>
  );
}
