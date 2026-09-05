/**
 * Universal Email Opener Utility for Mughal Steel Fabrication
 * Opens direct email composer (Gmail web compose on desktop browsers, 
 * native mail client on mobile devices) prefilled with recipient, subject, and body.
 */
export const openDirectEmail = (
  email: string = 'mughalsteelfabrication51@gmail.com',
  subject?: string,
  body?: string
) => {
  // Generate random reference code to prevent Gmail thread grouping into spam
  const refCode = `MSF-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const finalSubject = subject || `New Project Inquiry: Custom Steel Fabrication [Ref #${refCode}]`;
  const finalBody = body || `Respected Mughal Steel Fabrication Team,

I would like to inquire about your custom architectural steel fabrication services. Please find my project requirements below:

• Client Name: 
• Contact / WhatsApp: 
• Site City & Address: 
• Required Items (e.g. Main Gate, Stair Railing, Laser Grills, Canopy): 
• Estimated Dimensions / Details: 

Please provide your catalog pricing and let me know when an on-site laser measurement visit can be scheduled.

Thank you.`;

  const encEmail = encodeURIComponent(email);
  const encSub = encodeURIComponent(finalSubject);
  const encBody = encodeURIComponent(finalBody);

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encEmail}&su=${encSub}&body=${encBody}`;
  const mailtoUrl = `mailto:${email}?subject=${encSub}&body=${encBody}`;

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    window.location.href = mailtoUrl;
  } else {
    // Open Gmail web composer directly in a new tab for seamless 1-click email sending
    const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    // Fallback to native mailto if popup was blocked
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = mailtoUrl;
    }
  }
};
