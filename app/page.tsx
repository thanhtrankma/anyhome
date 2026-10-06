import { About } from "@/components/sections/About";
import { Capacity } from "@/components/sections/Capacity";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { News } from "@/components/sections/News";
import { Partners } from "@/components/sections/Partners";
import { Projects } from "@/components/sections/Projects";
import { SiteShell } from "@/components/site/site-shell";
import { company, heroSlides } from "@/lib/data";
import { getEquipments, getPublishedPosts, getPublishedProjects, getSettings } from "@/lib/store";

export default async function HomePage() {
  const [settings, equipments, projects, posts] = await Promise.all([
    getSettings(),
    getEquipments(),
    getPublishedProjects(),
    getPublishedPosts(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: company.legalName,
    alternateName: company.brand,
    taxID: company.taxCode,
    foundingDate: String(company.founded),
    slogan: company.slogan,
    telephone: settings.hotline,
    email: settings.email,
    url: `https://${settings.website}`,
    address: { "@type": "PostalAddress", streetAddress: settings.officeAddress, addressCountry: "VN" },
  };

  return (
    <SiteShell settings={settings}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero slides={heroSlides} stats={settings.stats} />
      <About />
      <Capacity equipments={equipments} />
      <Projects projects={projects} />
      <Partners />
      <News posts={posts} />
      <Contact settings={settings} />
    </SiteShell>
  );
}
