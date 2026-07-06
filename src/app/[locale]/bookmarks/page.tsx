import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getTranslations } from "next-intl/server";
import { BookmarkGrid } from "@/components/bookmarks/BookmarkGrid";
import { getBookmarks } from "@/lib/data-reader";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Bookmarks", description: "Curated resources and tools I find useful" };
}

export default async function BookmarksPage() {
  const t = await getTranslations("bookmarks");
  const bookmarks = getBookmarks();

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <BookmarkGrid
          bookmarks={bookmarks}
          categories={["all", "resource", "tool", "inspiration", "reference"]}
          searchPlaceholder={t("search_placeholder")}
          allCategoriesLabel={t("all_categories")}
          noBookmarksTitle={t("no_bookmarks")}
          noBookmarksDesc={t("no_bookmarks_desc")}
        />
      </div>
    </div>
  );
}
