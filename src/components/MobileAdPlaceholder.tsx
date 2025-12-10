import React from "react";

export function MobileAdPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Sponsored"
      className="w-full bg-muted rounded-md flex items-center justify-center py-3 px-4"
    >
      <span className="text-xs text-muted-foreground">Sponsored</span>
    </div>
  );
}

export default MobileAdPlaceholder;
