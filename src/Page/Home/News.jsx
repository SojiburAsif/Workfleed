import React, { useState, useContext } from "react";
import { FaTimes, FaInfoCircle, FaRegNewspaper } from "react-icons/fa"; 
import { ThemeContext } from "../../Theme/ThemeProvider";

const newsData = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    title: "HRMS Platform Launch",
    shortDesc:
      "Our company introduces a new HRMS platform to manage employee workflow efficiently.",
    longDesc:
      "The HRMS platform allows HR executives to monitor employee workload, manage payroll, track contracts, and oversee workflow seamlessly. Employees can update their daily progress, while HR can generate detailed reports. 🌟 Features include task tracking, automated reminders, attendance monitoring, and analytics dashboards for data-driven decisions.",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    title: "Employee Performance Reports",
    shortDesc:
      "Admins can now generate reports for payroll, attendance, and task performance in real-time.",
    longDesc:
      "The new reporting feature enables HR and Admin to analyze productivity trends, export payroll data in PDF or Excel, and ensure compliance with regulations. 📊 Advanced filters, export options, and monthly/annual comparisons help identify top performers and areas for improvement.",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    title: "Workflow Automation",
    shortDesc:
      "Automation tools added for faster task approvals and streamlined communication.",
    longDesc:
      "Workflow automation reduces manual work and increases efficiency. Employees receive instant notifications about pending tasks, while HR can approve or decline submissions with a single click. ⚡ Automation also includes role-based access, multi-step approvals, and seamless integration with payroll systems.",
  },
];

const News = () => {
  const [selectedNews, setSelectedNews] = useState(null);
  const { theme } = useContext(ThemeContext);

  const sectionBg =
    theme === "dark" ? "bg-black text-gray-100" : "bg-gray-50 text-gray-800";
  
  // Card background: Light mode -> gray-50, Dark mode -> gray-950
  const cardBg = theme === "dark" ? "bg-gray-950 text-gray-100" : "bg-gray-200 text-gray-800";

  const mainCardBg = theme === "dark" ? "bg-gray-950" : "bg-white";
  const hoverShadow = "hover:shadow-red-400 transition-shadow duration-300";

  return (
    <section className={`${sectionBg} py-16`}>
      <div className="max-w-7xl mx-auto  flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-12 flex items-center gap-3">
          <FaRegNewspaper className="text-red-500" />
          Our Recent News & Insights
        </h1>

        {/* Main card container */}
        <div
          className={`${mainCardBg} rounded-3xl p-12 flex flex-col md:flex-row gap-8 items-center justify-center`}
        >
          {newsData.map((news) => (
            <div
              key={news.id}
              className={`${cardBg} rounded-2xl overflow-hidden  flex flex-col md:flex-1 max-w-sm ${hoverShadow}`}
            >
              <img
                src={news.img}
                alt={news.title}
                className="h-64 w-full object-cover p-4 rounded-2xl"
              />
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold mb-3">{news.title}</h3>
                <p className="text-gray-400 flex-1 mb-4">{news.shortDesc}</p>
                <button
                  onClick={() => setSelectedNews(news)}
                  className="flex items-center gap-2 text-red-500 hover:underline self-start font-semibold"
                >
                  <FaInfoCircle /> See More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedNews && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`${cardBg} rounded-2xl p-6 max-w-2xl w-full relative shadow-2xl`}>
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                onClick={() => setSelectedNews(null)}
              >
                <FaTimes size={20} />
              </button>
              
              <img
                src={selectedNews.img}
                alt={selectedNews.title}
                className="w-full h-56 object-cover rounded-xl mb-5"
              />
              
              <h2 className="text-2xl font-bold mb-3">{selectedNews.title}</h2>
              <p className="text-gray-400 leading-relaxed">{selectedNews.longDesc}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default News;
