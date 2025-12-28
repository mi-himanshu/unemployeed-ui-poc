import React from 'react';

const AuthFooter: React.FC = () => (
  <footer className="text-white py-6 w-full">
    <div className="max-w-7xl mx-auto px-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left - Privacy Policy */}
        <div>
          <a 
            href="#" 
            className="text-[#f6f6f6]/80 hover:text-[#f6f6f6] transition-colors"
            style={{ fontSize: '16px', fontWeight: 400 }}
          >
            Privacy Policy
          </a>
        </div>

        {/* Right - Copyright */}
        <div 
          className="text-[#f6f6f6]/80"
          style={{ fontSize: '16px', fontWeight: 400 }}
        >
          © 2025 Unemployeed™. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);

export default AuthFooter;

