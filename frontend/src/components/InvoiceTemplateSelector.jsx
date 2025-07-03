
import { Check, Star } from "lucide-react"

const InvoiceTemplateSelector = ({ selectedTemplate, onTemplateSelect }) => {
  const templates = [
    {
      id: "1",
      name: "Modern Minimalist",
      preview: "/template1.png",
      popular: true,
      colors: ["#000000", "#4B5563", "#E5E7EB"],
    },
    {
      id: "2",
      name: "Professional Corporate",
      preview: "/template2.png",
      popular: false,
      colors: ["#111827", "#6B7280", "#D1D5DB"],
    },
    {
      id: "3",
      name: "Vibrant Gradient",
      preview: "/template3.png",
      popular: false,
      colors: ["#06b6d4", "#8b5cf6", "#f472b6"],
    },
    {
      id: "4",
      name: "Simple Clean",
      preview: "/template4.png",
      popular: false,
      colors: ["#000000", "#9CA3AF", "#FFFFFF"],
    },
    {
      id: "5",
      name: "Typewriter Retro",
      preview: "/template5.png",
      popular: true,
      colors: ["#1f2937", "#6b7280", "#f3f4f6"],
    },
  ];

  return (
    <div className="template-selector">
      <div className="template-header">
        <h3>Choose Invoice Template</h3>
        <p>Select a template that matches your brand</p>
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? "selected" : ""}`}
            onClick={() => onTemplateSelect(template.id)}
          >
            {template.popular && (
              <div className="template-badge">
                <Star size={12} />
                Popular
              </div>
            )}

            <div className="template-preview">
              <img 
                src={template.preview}
                alt={`${template.name} preview`}
                className="template-image"
              />
            </div>

            <div className="template-info">
              <h4>{template.name}</h4>
              <div className="template-colors">
                {template.colors.map((color, index) => (
                  <div key={index} className="color-dot" style={{ backgroundColor: color }}></div>
                ))}
              </div>
            </div>

            {selectedTemplate === template.id && (
              <div className="template-selected">
                <Check size={20} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceTemplateSelector;
