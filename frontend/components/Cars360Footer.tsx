import Link from "next/link";

export default function Cars360Footer() {
  return (
    <footer style={{ background: "#0F2A4A", color: "white", paddingTop: 60, paddingBottom: 40, marginTop: 80 }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
        {/* Main Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 40,
          marginBottom: 60,
        }}>
          {/* Marketplace */}
          <div>
            <h4 style={{ margin: "0 0 16px", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Marketplace
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {["Browse Cars", "Locally Used", "Imports", "Brand New", "Parts & Accessories"].map((item) => (
                <li key={item} style={{ marginBottom: 10 }}>
                  <a href="#" style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    transition: "color 200ms ease",
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#E8700A";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ margin: "0 0 16px", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Services
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {["Vehicle Import", "Valuation", "Insurance", "Tracking", "Logbook Financing"].map((item) => (
                <li key={item} style={{ marginBottom: 10 }}>
                  <a href="#" style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    transition: "color 200ms ease",
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#E8700A";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ margin: "0 0 16px", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Company
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {["About Us", "Contact Us", "FAQs", "Careers"].map((item) => (
                <li key={item} style={{ marginBottom: 10 }}>
                  <a href="#" style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    transition: "color 200ms ease",
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#E8700A";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ margin: "0 0 16px", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Legal
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {["Terms & Conditions", "Privacy Policy", "Cookie Policy", "Data Protection"].map((item) => (
                <li key={item} style={{ marginBottom: 10 }}>
                  <a href="#" style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    transition: "color 200ms ease",
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#E8700A";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ margin: "0 0 16px", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Contact Us
            </h4>
            <div style={{ fontSize: "0.85rem", lineHeight: 1.8, color: "rgba(255,255,255,0.8)" }}>
              <p style={{ margin: "0 0 12px" }}>
                Hardy Business Park,
                <br />
                3rd Floor, Ushirika Road
                <br />
                Karen, Nairobi, Kenya
              </p>
              <p style={{ margin: "0 0 8px" }}>
                <a href="tel:+254709335023" style={{ color: "#E8700A", textDecoration: "none", fontWeight: 600 }}>
                  +254 709 335 023
                </a>
              </p>
              <p style={{ margin: 0 }}>
                <a href="mailto:info@cars360.co.ke" style={{ color: "#E8700A", textDecoration: "none", fontWeight: 600 }}>
                  info@cars360.co.ke
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", marginBottom: 30 }} />

        {/* Bottom Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.6)",
        }}>
          <div>© 2026 CARS360. All rights reserved.</div>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "color 200ms ease" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#E8700A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
              }}
            >
              Terms
            </a>
            <span>|</span>
            <a href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "color 200ms ease" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#E8700A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
              }}
            >
              Privacy
            </a>
            <span>|</span>
            <a href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "color 200ms ease" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#E8700A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
              }}
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
