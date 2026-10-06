import { About } from "@/components/sections/About";
import { Capacity } from "@/components/sections/Capacity";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { News } from "@/components/sections/News";
import { Partners } from "@/components/sections/Partners";
import { Projects } from "@/components/sections/Projects";
import { SiteShell } from "@/components/site/site-shell";
import { getEquipments, getPublishedPosts, getPublishedProjects, getSettings, getSiteContent } from "@/lib/store";

export default async function HomePage() {
  const [settings, content, equipments, projects, posts] = await Promise.all([
    getSettings(),
    getSiteContent(),
    getEquipments(),
    getPublishedProjects(),
    getPublishedPosts(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: content.general.legalName,
    alternateName: content.general.brand,
    taxID: content.general.taxCode,
    foundingDate: String(content.general.founded),
    slogan: content.general.slogan,
    telephone: settings.hotline,
    email: settings.email,
    url: `https://${settings.website}`,
    address: { "@type": "PostalAddress", streetAddress: settings.officeAddress, addressCountry: "VN" },
  };

  return (
    <SiteShell settings={settings} content={content}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero slides={content.hero.slides} stats={settings.stats} videoUrl={content.hero.videoUrl || undefined} />
      <About content={content} />
      <Capacity equipments={equipments} content={content.capacity} />
      <Projects projects={projects} heading={content.sections} />
      <Partners items={content.partners.items} heading={content.sections} />
      <News posts={posts} heading={content.sections} />
      <Contact settings={settings} heading={content.sections} />
    </SiteShell>
  );
}
