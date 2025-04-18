// import { useMemo } from "react";
// import About from "./About";
// import Certifications from "./Certifications";
// import Contact from "./Contact/Contact";
// import Counter from "./Counter";
// import Error from "./Error/Error";
// import Hero from "./Hero";
// import Loading from "./Loading/Loading";
// import Portfolio from "./Portfolio";
// import Services from "./Services";
// import Testimonial from "./Testimonial";
// import useFetch from "./useFetch";
// import { useSectionVisibility } from "../CMSAdmin/SectionVisibilityContext/SectionVisibilityContext";
// import DynamicSections from "./DynamicSections/DynamicSections";
// import NullData from "./NullData/NullData";

// const Home = () => {
//   const API_URL = useMemo(
//     () => process.env.REACT_APP_BACKEND_URL || "http://localhost:8000",
//     []
//   );

//   const { data: hero } = useFetch(`${API_URL}/api/hero`);
//   const { data: about } = useFetch(`${API_URL}/api/about`);
//   const { data: skills } = useFetch(`${API_URL}/api/skills`);
//   const { data: services } = useFetch(`${API_URL}/api/services`);
//   const { data: counts } = useFetch(`${API_URL}/api/counts`);
//   const { data: works } = useFetch(`${API_URL}/api/works`);
//   const { data: testimonials } = useFetch(`${API_URL}/api/testimonials`);
//   const { data: dynamicSections } = useFetch(`${API_URL}/api/dynamicSections`);
//   const { data: certifications } = useFetch(`${API_URL}/api/certifications`);
//   const { data: contacts } = useFetch(`${API_URL}/api/contact`);
//   const { data: links } = useFetch(`${API_URL}/api/social`);
//   const { sections = [], isPending, error } = useSectionVisibility();
//   // Sort and filter sections based on visibility and order
//   const visibleSections = useMemo(() => {
//     return (sections || []) // Ensure sections is an array
//       .filter((section) => section.isVisible) // Filter out invisible sections
//       .sort((a, b) => a.order - b.order); // Sort by order
//   }, [sections]);

//   // const matchedDynamicSections = visibleSections
//   //   .map((section) => {
//   //     return dynamicSections.find((dynamicSection) => {
//   //       const cleanSectionName = section.name.replace(" Section", "").trim();
//   //       return dynamicSection.title.trim() === cleanSectionName;
//   //     });
//   //   })
//   //   .filter(Boolean); // Remove undefined values

//   // console.log("matchedDynamicSection", matchedDynamicSection);
//   // Check for loading and error states
//   if (isPending) {
//     return <Loading />;
//   }

//   if (error) {
//     return <Error message={error} />;
//   }
//   // console.log("matchedDynamic section", matchedDynamicSection);
//   console.log("Dynamic Sections from API:", dynamicSections);
//   console.log("Visible Sections from Context:", visibleSections);
//   return (
//     <>
//       {/* <main id="main">
//         {visibleSections.map((section) => {
//           switch (section.name) {
//             case "Hero Section":
//               return <Hero key={section._id} hero={hero || []} />;
//             case "About Section":
//               return (
//                 <About
//                   key={section._id}
//                   about={about || []}
//                   skills={skills || []}
//                 />
//               );
//             case "Services Section":
//               return (
//                 <Services
//                   key={section._id}
//                   title="Services"
//                   subtitle="Delivering solutions that exceed expectations."
//                   services={services || []}
//                 />
//               );
//             case "Counter Section":
//               return <Counter key={section._id} counts={counts || []} />;
//             case "Portfolio Section":
//               return (
//                 <Portfolio
//                   key={section._id}
//                   title="Portfolio"
//                   subtitle="We turn ideas into impactful results."
//                   works={works || []}
//                 />
//               );
//             case "Testimonial Section":
//               return (
//                 <Testimonial
//                   key={section._id}
//                   testimonials={testimonials || []}
//                   className="mt-5"
//                 />
//               );
//             case "Dynamic Sections":
//               return (
//                 <DynamicSections
//                   key={section._id}
//                   dynamicSections={dynamicSections || []}
//                 />
//               );
//             case "Certifications Section":
//               return (
//                 <Certifications
//                   key={section._id}
//                   title="Certifications"
//                   subtitle="Showcasing milestones of excellence"
//                   certifications={certifications || []}
//                 />
//               );
//             case "Contact Section":
//               return (
//                 <Contact
//                   key={section._id}
//                   contact={contacts || []}
//                   links={links || []}
//                 />
//               );
//             default:
//               return null; // In case of an unknown section name
//           }
//         })}
//       </main> */}
//       <main id="main">
//         {visibleSections.map((section) => {
//           const matchedDynamic = (dynamicSections || []).find(
//             (dynamicSection) =>
//               dynamicSection.title.trim() ===
//               section.name.replace(" Section", "").trim()
//           );
//           console.log("section.name",section.name);

//           // Handle static sections
//           switch (section.name) {
//             case "Hero Section":
//               return <Hero key={section._id} hero={hero || []} />;
//             case "About Section":
//               return (
//                 <About
//                   key={section._id}
//                   about={about || []}
//                   skills={skills || []}
//                 />
//               );
//             case "Services Section":
//               return (
//                 <Services
//                   key={section._id}
//                   services={services || []}
//                   title="Services"
//                   subtitle="Delivering solutions that exceed expectations."
//                 />
//               );
//             case "Counter Section":
//               return <Counter key={section._id} counts={counts || []} />;
//             case "Portfolio Section":
//               return (
//                 <Portfolio
//                   key={section._id}
//                   works={works || []}
//                   title="Portfolio"
//                   subtitle="We turn ideas into impactful results."
//                 />
//               );
//             case "Testimonial Section":
//               return (
//                 <Testimonial
//                   key={section._id}
//                   testimonials={testimonials || []}
//                 />
//               );
//             case "Certifications Section":
//               return (
//                 <Certifications
//                   key={section._id}
//                   title="Certifications"
//                   subtitle="Showcasing milestones of excellence"
//                   certifications={certifications || []}
//                 />
//               );

//             case "Contact Section":
//               return (
//                 <Contact
//                   key={section._id}
//                   contact={contacts || []}
//                   links={links || []}
//                 />
//               );
//             default:
//               // Render matched dynamic sections
//               if (matchedDynamic) {
//                 return (
//                   <DynamicSections
//                     key={section._id}
//                     dynamicSections={[matchedDynamic]}
//                     className="mb-5"
//                   />
//                 );
//               }
//               return null;
//           }
//         })}
//       </main>
//       {/* End #main */}
//     </>
//   );
// };

// export default Home;

import { useMemo, useState, useEffect, Suspense, lazy } from "react";
import LazyLoadSection from "./LazyLoadSection";
import Loading from "./Loading/Loading";
import Error from "./Error/Error";
import PortfolioCardSkeletonLoading from "./portfolioCardSkeletonLoading";
import CertificationSkeletonLoader from "./certificationSkeletonLoader";
import HeroSkeletonLoader from "./heroSkeletonLoader";
import AboutSkeletonLoader from "./aboutSkeletonLoader";
import DynamicSections from "./DynamicSections/DynamicSections";
import useFetchAll from "./useFetchAll";
import useFetch from "./useFetch";

// ✅ Lazy load sections
const Hero = lazy(() => import("./Hero"));
const About = lazy(() => import("./About"));
const Services = lazy(() => import("./Services"));
const Counter = lazy(() => import("./Counter"));
const Portfolio = lazy(() => import("./Portfolio"));
const Testimonial = lazy(() => import("./Testimonial"));
const Certifications = lazy(() => import("./Certifications"));
const Contact = lazy(() => import("./Contact/Contact"));
const TermsandConditions = lazy(() =>
  import("./TermsAndConditions/Terms&Conditions")
);
const CVPreview = lazy(() => import("../CMSAdmin/UploadCV/CVPreview"));
// const DynamicSections = lazy(() => import("./DynamicSections/DynamicSections"));

const Home = () => {
  const API_URL = useMemo(
    () => process.env.REACT_APP_BACKEND_URL || "http://localhost:8000",
    []
  );
  const endpoints = useMemo(
    () => [
      "hero",
      "about",
      "contact",
      "dynamicSections",
      "skills",
      "services",
      "counts",
      "works",
      "testimonials",
      "certifications",
      "social",
      "terms",
      "cv",
    ],
    []
  );

  const { data, isLoading, error } = useFetchAll(API_URL, endpoints);
  // console.log("data loop",data)
  console.log("data.:", data);
  const [visibleSections, setVisibleSections] = useState([]);
  const [isPending, setIsPending] = useState(true); // Initially true
  const { data: visibleCVs, setData: setVisibleCVs } = useFetch(
    `${API_URL}/api/cv/visibleCVs`
  );
  const { data: settings } = useFetch(`${API_URL}/api/settings`);

  console.log("visibleCVs:", visibleCVs);
  useEffect(() => {
    setIsPending(true); // Set loading state to true before fetching
    const fetchVisibleSections = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/sectionVisibility/visible`
        );
        const dataVisible = await response.json();

        setVisibleSections(dataVisible); // Set state with fetched data
        // console.log("dataVisible seee",dataVisible);
      } catch (error) {
        console.error("Error fetching visible sections:", error);
      } finally {
        setIsPending(false); // Set loading state to false after fetch completes
      }
    };

    fetchVisibleSections();
  }, []); // Runs only once when component mounts

  // ✅ Handle Loading & Error
  if (isLoading || isPending) return <Loading />;
  if (error) return <Error message={error} />;
  if (!settings) return <Loading />;
  return (
    <main id="main">
      <Suspense fallback={<Loading />}>
        {visibleSections.map((section) => {
          // console.log("section._id",section._id, section);
          // console.log(
          //   "data[section, section.name]",
          //   section,
          //   data[section.name]
          // );
          const sectionSettings =
            Object.values(settings).find((s) => s.name === section.name) || {};

          const sectionTitle = sectionSettings.title || section.name;
          const sectionSubtitle = sectionSettings.subtitle || "";

          // console.log("settings", settings);
          // console.log("sectionTitle", sectionTitle);
          // console.log("sectionSubtitle", sectionSubtitle);
          return (
            <LazyLoadSection key={section._id}>
              {(() => {
                //terms is missing
                switch (section.name) {
                  case "Introduction":
                    return !data.hero || data.hero.length === 0 ? (
                      <div className="row justify-content-center">
                        <div className="col-md-12">
                          {" "}
                          <HeroSkeletonLoader />
                        </div>{" "}
                      </div>
                    ) : (
                      <Hero key={section._id} hero={data.hero[0] || {}} />
                    );
                  case "About":
                    return !data.about || data.about.length === 0 ? (
                      <div className="row justify-content-center">
                        <div className="col-md-10">
                          {" "}
                          <AboutSkeletonLoader />
                        </div>{" "}
                        <About
                          about={data.about || []}
                          skills={data.skills || []}
                        />{" "}
                      </div>
                    ) : (
                      <About
                        key={section._id}
                        about={data.about || []}
                        skills={data.skills || []}
                        title={sectionTitle}
                      />
                    );
                  case "Services":
                    return (
                      <Services
                        key={section._id}
                        services={data.services || []}
                        title={sectionTitle}
                        subtitle={sectionSubtitle}
                      />
                    );
                  case "Counter":
                    return (
                      <Counter key={section._id} counts={data.counts || []} />
                    );
                  case "Portfolio":
                    return !data.works || data.works.length === 0 ? (
                      <div className="row justify-content-center">
                        <div className="col-md-3">
                          {" "}
                          <PortfolioCardSkeletonLoading />{" "}
                        </div>{" "}
                        <div className="col-md-3">
                          {" "}
                          <PortfolioCardSkeletonLoading />{" "}
                        </div>{" "}
                        <div className="col-md-3">
                          {" "}
                          <PortfolioCardSkeletonLoading />
                        </div>{" "}
                      </div>
                    ) : (
                      <Portfolio
                        key={section._id}
                        works={data.works}
                        title={sectionTitle}
                        subtitle={sectionSubtitle}
                      />
                    );
                  // <Portfolio works={data.works || []} title="Portfolio" subtitle="We turn ideas into impactful results." />;
                  case "Testimonial":
                    return (
                      <Testimonial
                        key={section._id}
                        testimonials={data.testimonials || []}
                      />
                    );
                  case "Certifications":
                    return !data.certifications ||
                      data.certifications.length === 0 ? (
                      <div className="row justify-content-center">
                        <div className="col-md-3">
                          {" "}
                          <CertificationSkeletonLoader />{" "}
                        </div>{" "}
                        <div className="col-md-3">
                          {" "}
                          <CertificationSkeletonLoader />{" "}
                        </div>{" "}
                        <div className="col-md-3">
                          {" "}
                          <CertificationSkeletonLoader />
                        </div>{" "}
                      </div>
                    ) : (
                      <Certifications
                        title={sectionTitle}
                        subtitle={sectionSubtitle}
                        key={section._id}
                        certifications={data.certifications || []}
                      />
                    );
                  case "Contact":
                    return (
                      <Contact
                        key={section._id}
                        contact={data.contact || []}
                        links={data.social || []}
                        title={sectionTitle}
                      />
                    );
                  case "Terms and Conditions":
                    return (
                      <TermsandConditions
                        key={section._id}
                        termsList={data.termsList || []}
                        className="mt-5"
                        title={sectionTitle}
                      />
                    );
                  case "CV":
                    return !data["cv"] ? (
                      <Loading />
                    ) : (
                      visibleCVs &&
                        visibleCVs.map((cv) => (
                          <CVPreview key={cv._id} cv={cv || []} />
                        ))
                    );

                  default:
                    return data[section.name] ? (
                      <DynamicSections
                        dynamicSections={data[section.name]}
                        className="mb-5"
                      />
                    ) : null;
                  //matchedDynamic ? <DynamicSections key={section._id} dynamicSections={[matchedDynamic]} className="mb-5" /> : null;
                }
              })()}
            </LazyLoadSection>
          );
        })}
      </Suspense>
    </main>
  );
};

export default Home;
