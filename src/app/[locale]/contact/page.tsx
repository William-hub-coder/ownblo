import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-2xl">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <ScrollReveal delay={0.1}>
          <div className="mt-12">
            <ContactForm />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
