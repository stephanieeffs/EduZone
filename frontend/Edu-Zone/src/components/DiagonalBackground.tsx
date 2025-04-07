
import React from 'react';
import { motion } from 'framer-motion';

const DiagonalBackground = () => {
  return (
    <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
      <motion.div 
        className="absolute top-0 right-0 h-full bg-eduBlue"
        initial={{ width: "0%" }}
        animate={{ width: "45%" }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)"
        }}
      />
    </div>
  );
};

export default DiagonalBackground;
