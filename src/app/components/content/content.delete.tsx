import type { Content } from "app/models/content.model";

interface ContentDeleteProps {
  content?: Content;
}

export function ContentDelete({ content }: ContentDeleteProps) {
  return (
    <div className="py-4">
      <p className="text-center text-muted-foreground">
        You are about to delete the content with ID:{" "}
        <span className="font-semibold text-foreground">{content?.id}</span>
      </p>
      <p className="text-center text-sm text-muted-foreground mt-2">
        This action cannot be undone.
      </p>
    </div>
  );
}