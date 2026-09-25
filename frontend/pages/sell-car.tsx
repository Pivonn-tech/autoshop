import { useState, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

// Disable static generation for this page since it requires authentication
export const dynamic = 'force-dynamic';

// Arrow and Check icons from appointments.tsx
function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CheckCircle() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

const STEPS = ["Car Details", "Images & Features", "Pricing & Contact", "Review"];

// Kenyan counties for location selection
const KENYAN_COUNTIES = [
  "Nairobi", "Mombasa", "Kiambu", "Nakuru", "Machakos", "Kajiado", "Uasin Gishu", "Meru", "Kilifi", "Kwale",
  "Kakamega", "Bungoma", "Kericho", "Bomet", "Nyeri", "Murang'a", "Kirinyaga", "Embu", "Tharaka Nithi", 
  "Nyandarua", "Laikipia", "Isiolo", "Samburu", "Turkana", "West Pokot", "Trans Nzoia", "Elgeyo Marakwet",
  "Nandi", "Baringo", "Homabay", "Migori", "Kisii", "Nyamira", "Siaya", "Kisumu", "Vihiga", "Busia",
  "Mandera", "Wajir", "Garissa", "Marsabit", "Tana River", "Lamu", "Taita Taveta", "Makueni", "Kitui"
];

const CAR_MAKES = [
  "Toyota", "Nissan", "Honda", "Mazda", "Mitsubishi", "Subaru", "Isuzu", "Suzuki", "Hyundai", "KIA", 
  "Ford", "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Volvo", "Peugeot", "Renault", "Chevrolet", "Other"
];

const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Station Wagon", "Pickup", "Van", "Coupe", "Convertible"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Manual", "Automatic"];
const CONDITIONS = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

const COMMON_FEATURES = [
  "Air Conditioning", "Power Steering", "Power Windows", "Central Locking", "ABS Brakes", "Airbags",
  "Alloy Wheels", "Fog Lights", "Sunroof", "Leather Seats", "DVD Player", "Reverse Camera", 
  "Parking Sensors", "Cruise Control", "Bluetooth", "Navigation System", "Heated Seats"
];

interface FormData {
  // Car Details
  make: string;
  model: string;
  year: string;
  mileage: string;
  color: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  engineSize: string;
  condition: string;
  
  // Images & Features  
  images: File[];
  features: string[];
  description: string;
  title: string;
  
  // Pricing & Contact
  price: string;
  negotiable: boolean;
  contactPhone: string;
  contactEmail: string;
  county: string;
  town: string;
  specificLocation: string;
}

export default function SellCar() {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  
  const [form, setForm] = useState<FormData>({
    // Car Details
    make: "", model: "", year: "", mileage: "", color: "", bodyType: "", 
    fuelType: "", transmission: "", engineSize: "", condition: "",
    // Images & Features
    images: [], features: [], description: "", title: "",
    // Pricing & Contact
    price: "", negotiable: true, contactPhone: "", contactEmail: session?.user?.email || "",
    county: "", town: "", specificLocation: ""
  });

  // Redirect to login if not authenticated
  if (!session) {
    router.push('/auth/login?callbackUrl=' + encodeURIComponent('/sell-car'));
    return null;
  }

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm(f => ({ ...f, [key]: value }));
    setErrors(err => ({ ...err, [key]: undefined }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setErrors(err => ({ ...err, images: "Only JPEG, PNG, WebP files under 10MB are allowed" }));
      return;
    }

    // Limit to 10 images total
    const currentImages = form.images.length;
    const newImages = validFiles.slice(0, 10 - currentImages);
    
    setForm(f => ({ ...f, images: [...f.images, ...newImages] }));
    setErrors(err => ({ ...err, images: undefined }));

    // Create previews
    newImages.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagesPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm(f => ({ 
      ...f, 
      images: f.images.filter((_, i) => i !== index) 
    }));
    setImagesPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleFeature = (feature: string) => {
    setForm(f => ({
      ...f,
      features: f.features.includes(feature) 
        ? f.features.filter(feat => feat !== feature)
        : [...f.features, feature]
    }));
  };

  const validate = (stepIndex: number): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    
    if (stepIndex === 0) {
      // Car Details validation
      if (!form.make) e.make = "Make is required";
      if (!form.model.trim()) e.model = "Model is required";
      const yearNum = parseInt(form.year, 10);
      if (!form.year.trim()) {
        e.year = "Year is required";
      } else if (isNaN(yearNum) || yearNum < 1980 || yearNum > new Date().getFullYear() + 1) {
        e.year = `Enter a year between 1980 and ${new Date().getFullYear() + 1}`;
      }
      if (!form.mileage.trim()) {
        e.mileage = "Mileage is required";
      } else if (isNaN(parseInt(form.mileage)) || parseInt(form.mileage) < 0) {
        e.mileage = "Enter a valid mileage";
      }
      if (!form.color.trim()) e.color = "Color is required";
      if (!form.bodyType) e.bodyType = "Body type is required";
      if (!form.fuelType) e.fuelType = "Fuel type is required";
      if (!form.transmission) e.transmission = "Transmission is required";
      if (!form.condition) e.condition = "Condition is required";
    }
    
    if (stepIndex === 1) {
      // Images & Features validation
      if (form.images.length === 0) e.images = "At least one image is required";
      if (!form.title.trim()) e.title = "Title is required";
      if (!form.description.trim()) {
        e.description = "Description is required";
      } else if (form.description.trim().length < 50) {
        e.description = "Description must be at least 50 characters";
      }
    }
    
    if (stepIndex === 2) {
      // Pricing & Contact validation
      if (!form.price.trim()) {
        e.price = "Price is required";
      } else if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
        e.price = "Enter a valid price";
      }
      
      const phoneRe = /^(\+?254|0)[17]\d{8}$/;
      if (!form.contactPhone.trim()) {
        e.contactPhone = "Phone number is required";
      } else if (!phoneRe.test(form.contactPhone.replace(/\s/g, ""))) {
        e.contactPhone = "Enter a valid Kenyan phone number (e.g. 0712 345678)";
      }
      
      if (!form.contactEmail.trim() || !form.contactEmail.includes("@")) {
        e.contactEmail = "Valid email required";
      }
      
      if (!form.county) e.county = "County is required";
      if (!form.town.trim()) e.town = "Town is required";
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { 
    if (validate(step)) setStep(s => s + 1); 
  };
  
  const back = () => setStep(s => s - 1);

  const submit = async () => {
    if (!validate(2)) return;
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const formData = new FormData();
      
      // Add all form fields
      formData.append('userId', session.user?.id ?? '');
      formData.append('make', form.make);
      formData.append('model', form.model);
      formData.append('year', form.year);
      formData.append('mileage', form.mileage);
      formData.append('color', form.color);
      formData.append('bodyType', form.bodyType);
      formData.append('fuelType', form.fuelType);
      formData.append('transmission', form.transmission);
      formData.append('engineSize', form.engineSize);
      formData.append('condition', form.condition);
      formData.append('price', form.price);
      formData.append('negotiable', form.negotiable.toString());
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('contactPhone', form.contactPhone);
      formData.append('contactEmail', form.contactEmail);
      
      // Add features and location as JSON
      formData.append('features', JSON.stringify(form.features));
      formData.append('location', JSON.stringify({
        county: form.county,
        town: form.town,
        specificLocation: form.specificLocation
      }));
      
      // Add images
      form.images.forEach((image, index) => {
        formData.append('images', image);
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/car-listings`, {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setSubmitError(data.message || "Failed to submit listing. Please try again.");
        setSubmitting(false);
        return;
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError("Network error — please try again.");
      setSubmitting(false);
    }
  };

  // Styles - matching appointments.tsx patterns
  const inputStyle: React.CSSProperties = {
    width: "100%", height: 48, paddingInline: 14,
    background: "var(--bg)", border: "1.5px solid var(--border)",
    borderRadius: 8, color: "var(--text)", fontSize: "0.9375rem", outline: "none",
    fontFamily: "inherit", transition: "border-color 180ms ease",
  };
  
  const errorStyle: React.CSSProperties = { 
    fontSize: "0.78rem", color: "#DC2626", marginTop: 4 
  };
  
  const labelStyle: React.CSSProperties = { 
    fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", 
    marginBottom: 6, display: "block" 
  };

  // Success page
  if (submitted) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><CheckCircle /></div>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.8rem", fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>
            Car Listed Successfully!
          </h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 8 }}>
            Thank you! Your <strong>{form.year} {form.make} {form.model}</strong> has been submitted for review.
          </p>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28 }}>
            We'll review your listing and notify you at <strong>{form.contactEmail}</strong> once it's approved and live on our site.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, background: "var(--amber)", color: "white", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
              View My Listings <ArrowRight />
            </Link>
            <Link href="/cars" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingInline: 24, border: "1.5px solid var(--border)", color: "var(--text-secondary)", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: "0.9rem" }}>
              Browse Cars
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "var(--navy)", color: "white", paddingBlock: 48 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Sell Your Car</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: "white", margin: "0 0 10px", letterSpacing: "-0.025em" }}>
            Sell Your Car
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", lineHeight: 1.65, margin: 0 }}>
            List your car for sale and reach thousands of potential buyers across Kenya.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", paddingBlock: 24 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", maxWidth: 600, margin: "0 auto" }}>
            {STEPS.map((label, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative" }}>
                {/* connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{ position: "absolute", top: 20, left: "50%", right: "-50%", height: 2, background: i < step ? "var(--amber)" : "var(--border)", zIndex: 0 }} />
                )}
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: i < step ? "var(--navy)" : i === step ? "var(--amber)" : "var(--surface-2)", border: `2px solid ${i <= step ? (i === step ? "var(--amber)" : "var(--navy)") : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem", color: i <= step ? "white" : "var(--text-muted)", zIndex: 1, transition: "all 220ms ease" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: i === step ? "var(--navy)" : "var(--text-muted)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container" style={{ paddingBlock: 48 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
              <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", margin: 0 }}>
                Step {step + 1}: {STEPS[step]}
              </h2>
            </div>

            <div style={{ padding: "28px" }}>
              {/* Step 0: Car Details */}
              {step === 0 && (
                <div style={{ display: "grid", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Make *</label>
                      <select style={{ ...inputStyle, appearance: "none" }} value={form.make} onChange={set("make")}>
                        <option value="">Select make...</option>
                        {CAR_MAKES.map(make => <option key={make} value={make}>{make}</option>)}
                      </select>
                      {errors.make && <div style={errorStyle}>{errors.make}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Model *</label>
                      <input style={inputStyle} placeholder="e.g. Corolla, Vitz, Harrier" value={form.model} onChange={set("model")} />
                      {errors.model && <div style={errorStyle}>{errors.model}</div>}
                    </div>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Year *</label>
                      <input style={inputStyle} placeholder="e.g. 2019" type="number" min="1980" max="2026" value={form.year} onChange={set("year")} />
                      {errors.year && <div style={errorStyle}>{errors.year}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Mileage (KM) *</label>
                      <input style={inputStyle} placeholder="e.g. 50000" type="number" min="0" value={form.mileage} onChange={set("mileage")} />
                      {errors.mileage && <div style={errorStyle}>{errors.mileage}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Color *</label>
                      <input style={inputStyle} placeholder="e.g. White, Black, Silver" value={form.color} onChange={set("color")} />
                      {errors.color && <div style={errorStyle}>{errors.color}</div>}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Body Type *</label>
                      <select style={{ ...inputStyle, appearance: "none" }} value={form.bodyType} onChange={set("bodyType")}>
                        <option value="">Select body type...</option>
                        {BODY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                      {errors.bodyType && <div style={errorStyle}>{errors.bodyType}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Fuel Type *</label>
                      <select style={{ ...inputStyle, appearance: "none" }} value={form.fuelType} onChange={set("fuelType")}>
                        <option value="">Select fuel type...</option>
                        {FUEL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                      {errors.fuelType && <div style={errorStyle}>{errors.fuelType}</div>}
                    </div>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Transmission *</label>
                      <select style={{ ...inputStyle, appearance: "none" }} value={form.transmission} onChange={set("transmission")}>
                        <option value="">Select transmission...</option>
                        {TRANSMISSIONS.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                      {errors.transmission && <div style={errorStyle}>{errors.transmission}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Engine Size</label>
                      <input style={inputStyle} placeholder="e.g. 1.5L, 2000cc" value={form.engineSize} onChange={set("engineSize")} />
                    </div>
                    <div>
                      <label style={labelStyle}>Condition *</label>
                      <select style={{ ...inputStyle, appearance: "none" }} value={form.condition} onChange={set("condition")}>
                        <option value="">Select condition...</option>
                        {CONDITIONS.map(condition => <option key={condition} value={condition}>{condition}</option>)}
                      </select>
                      {errors.condition && <div style={errorStyle}>{errors.condition}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Images & Features */}
              {step === 1 && (
                <div style={{ display: "grid", gap: 24 }}>
                  <div>
                    <label style={labelStyle}>Car Images * (Max 10 images, 10MB each)</label>
                    <div style={{ 
                      border: "2px dashed var(--border)", 
                      borderRadius: 12, 
                      padding: "40px 20px", 
                      textAlign: "center", 
                      background: "var(--surface)",
                      cursor: "pointer",
                      transition: "all 200ms ease"
                    }} 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files);
                      const fileEvent = { target: { files } } as any;
                      handleImageUpload(fileEvent);
                    }}>
                      <UploadIcon />
                      <p style={{ margin: "16px 0 8px", fontWeight: 600, color: "var(--text)" }}>
                        Click to upload images or drag & drop
                      </p>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                        JPEG, PNG, WebP up to 10MB each
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                    {errors.images && <div style={errorStyle}>{errors.images}</div>}
                    
                    {/* Image Previews */}
                    {imagesPreviews.length > 0 && (
                      <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", 
                        gap: 12, 
                        marginTop: 16 
                      }}>
                        {imagesPreviews.map((preview, index) => (
                          <div key={index} style={{ position: "relative", aspectRatio: "1", borderRadius: 8, overflow: "hidden" }}>
                            <img 
                              src={preview} 
                              alt={`Preview ${index + 1}`} 
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              style={{
                                position: "absolute", top: 4, right: 4, width: 24, height: 24,
                                background: "rgba(0,0,0,0.7)", color: "white", border: "none",
                                borderRadius: "50%", cursor: "pointer", fontSize: "0.75rem"
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>Listing Title *</label>
                    <input 
                      style={inputStyle} 
                      placeholder="e.g. 2019 Toyota Corolla - Excellent Condition" 
                      value={form.title} 
                      onChange={set("title")}
                      maxLength={100}
                    />
                    {errors.title && <div style={errorStyle}>{errors.title}</div>}
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 4 }}>
                      {form.title.length}/100 characters
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Description * (Min 50 characters)</label>
                    <textarea 
                      style={{ ...inputStyle, height: 120, paddingBlock: 12, resize: "vertical" }} 
                      placeholder="Describe your car's condition, service history, modifications, reason for selling, etc."
                      value={form.description} 
                      onChange={set("description")}
                      maxLength={2000}
                    />
                    {errors.description && <div style={errorStyle}>{errors.description}</div>}
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 4 }}>
                      {form.description.length}/2000 characters
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Features & Equipment</label>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                      gap: 8, 
                      marginTop: 8 
                    }}>
                      {COMMON_FEATURES.map(feature => (
                        <label key={feature} style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 8, 
                          cursor: "pointer",
                          padding: "8px 12px",
                          border: "1px solid var(--border)",
                          borderRadius: 6,
                          background: form.features.includes(feature) ? "var(--amber-light)" : "var(--surface)",
                          transition: "all 150ms ease"
                        }}>
                          <input
                            type="checkbox"
                            checked={form.features.includes(feature)}
                            onChange={() => toggleFeature(feature)}
                            style={{ margin: 0 }}
                          />
                          <span style={{ fontSize: "0.875rem" }}>{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pricing & Contact */}
              {step === 2 && (
                <div style={{ display: "grid", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "end" }}>
                    <div>
                      <label style={labelStyle}>Asking Price (KSH) *</label>
                      <input 
                        style={inputStyle} 
                        placeholder="e.g. 1500000" 
                        type="number" 
                        min="0" 
                        step="1000"
                        value={form.price} 
                        onChange={set("price")} 
                      />
                      {errors.price && <div style={errorStyle}>{errors.price}</div>}
                    </div>
                    <label style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 8, 
                      cursor: "pointer", 
                      height: 48,
                      fontSize: "0.875rem"
                    }}>
                      <input
                        type="checkbox"
                        checked={form.negotiable}
                        onChange={set("negotiable")}
                      />
                      Negotiable
                    </label>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Contact Phone *</label>
                      <input 
                        style={inputStyle} 
                        placeholder="+254 7XX XXX XXX" 
                        value={form.contactPhone} 
                        onChange={set("contactPhone")} 
                      />
                      {errors.contactPhone && <div style={errorStyle}>{errors.contactPhone}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Contact Email *</label>
                      <input 
                        style={inputStyle} 
                        type="email" 
                        placeholder="your.email@example.com" 
                        value={form.contactEmail} 
                        onChange={set("contactEmail")} 
                      />
                      {errors.contactEmail && <div style={errorStyle}>{errors.contactEmail}</div>}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>County *</label>
                      <select style={{ ...inputStyle, appearance: "none" }} value={form.county} onChange={set("county")}>
                        <option value="">Select county...</option>
                        {KENYAN_COUNTIES.map(county => <option key={county} value={county}>{county}</option>)}
                      </select>
                      {errors.county && <div style={errorStyle}>{errors.county}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Town *</label>
                      <input 
                        style={inputStyle} 
                        placeholder="e.g. Westlands, Karen, Mombasa Town" 
                        value={form.town} 
                        onChange={set("town")} 
                      />
                      {errors.town && <div style={errorStyle}>{errors.town}</div>}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Specific Location (Optional)</label>
                    <input 
                      style={inputStyle} 
                      placeholder="e.g. Near ABC Mall, Opposite XYZ School" 
                      value={form.specificLocation} 
                      onChange={set("specificLocation")} 
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div style={{ display: "grid", gap: 24 }}>
                  <div style={{ 
                    background: "var(--surface)", 
                    padding: 20, 
                    borderRadius: 12, 
                    border: "1px solid var(--border)" 
                  }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: "1rem", fontWeight: 600 }}>Car Details</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: "0.875rem" }}>
                      <div><strong>Make & Model:</strong> {form.make} {form.model}</div>
                      <div><strong>Year:</strong> {form.year}</div>
                      <div><strong>Mileage:</strong> {parseInt(form.mileage).toLocaleString()} KM</div>
                      <div><strong>Color:</strong> {form.color}</div>
                      <div><strong>Body Type:</strong> {form.bodyType}</div>
                      <div><strong>Fuel Type:</strong> {form.fuelType}</div>
                      <div><strong>Transmission:</strong> {form.transmission}</div>
                      <div><strong>Condition:</strong> {form.condition}</div>
                      {form.engineSize && <div><strong>Engine Size:</strong> {form.engineSize}</div>}
                    </div>
                  </div>

                  <div style={{ 
                    background: "var(--surface)", 
                    padding: 20, 
                    borderRadius: 12, 
                    border: "1px solid var(--border)" 
                  }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: "1rem", fontWeight: 600 }}>Listing Info</h3>
                    <div style={{ fontSize: "0.875rem" }}>
                      <div style={{ marginBottom: 8 }}><strong>Title:</strong> {form.title}</div>
                      <div style={{ marginBottom: 8 }}><strong>Description:</strong></div>
                      <div style={{ 
                        background: "var(--bg)", 
                        padding: 12, 
                        borderRadius: 6, 
                        marginBottom: 12,
                        whiteSpace: "pre-wrap"
                      }}>
                        {form.description}
                      </div>
                      <div><strong>Images:</strong> {form.images.length} uploaded</div>
                      {form.features.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <strong>Features:</strong> {form.features.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ 
                    background: "var(--surface)", 
                    padding: 20, 
                    borderRadius: 12, 
                    border: "1px solid var(--border)" 
                  }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: "1rem", fontWeight: 600 }}>Pricing & Contact</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: "0.875rem" }}>
                      <div><strong>Price:</strong> KSH {parseInt(form.price).toLocaleString()} {form.negotiable && "(Negotiable)"}</div>
                      <div><strong>Phone:</strong> {form.contactPhone}</div>
                      <div><strong>Email:</strong> {form.contactEmail}</div>
                      <div><strong>Location:</strong> {form.town}, {form.county}</div>
                      {form.specificLocation && <div><strong>Specific Location:</strong> {form.specificLocation}</div>}
                    </div>
                  </div>

                  <div style={{ 
                    background: "var(--amber-light)", 
                    border: "1px solid var(--amber)", 
                    padding: 16, 
                    borderRadius: 8, 
                    fontSize: "0.875rem" 
                  }}>
                    <strong>Note:</strong> Your listing will be reviewed by our team before going live. 
                    This typically takes 1-2 business days. You'll be notified via email once approved.
                  </div>
                </div>
              )}

              {submitError && (
                <div style={{ 
                  background: "#FEE2E2", 
                  border: "1px solid #DC2626", 
                  color: "#DC2626", 
                  padding: 12, 
                  borderRadius: 8, 
                  fontSize: "0.875rem",
                  marginTop: 20
                }}>
                  {submitError}
                </div>
              )}

              {/* Navigation Buttons */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginTop: 32,
                paddingTop: 24,
                borderTop: "1px solid var(--border)"
              }}>
                <button 
                  onClick={back} 
                  disabled={step === 0}
                  style={{
                    height: 48, paddingInline: 24, background: "transparent", 
                    border: "1.5px solid var(--border)", color: "var(--text-secondary)", 
                    borderRadius: 8, fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer",
                    opacity: step === 0 ? 0.5 : 1, fontSize: "0.9rem",
                    transition: "all 180ms ease"
                  }}
                >
                  Back
                </button>

                {step < STEPS.length - 1 ? (
                  <button 
                    onClick={next}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8, height: 48, 
                      paddingInline: 24, background: "var(--amber)", color: "white", 
                      borderRadius: 8, fontWeight: 700, border: "none", cursor: "pointer",
                      fontSize: "0.9rem", transition: "all 180ms ease"
                    }}
                  >
                    Next <ArrowRight />
                  </button>
                ) : (
                  <button 
                    onClick={submit}
                    disabled={submitting}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8, height: 48, 
                      paddingInline: 24, background: submitting ? "var(--border)" : "var(--navy)", 
                      color: "white", borderRadius: 8, fontWeight: 700, border: "none", 
                      cursor: submitting ? "not-allowed" : "pointer", fontSize: "0.9rem",
                      transition: "all 180ms ease"
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit Listing"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}