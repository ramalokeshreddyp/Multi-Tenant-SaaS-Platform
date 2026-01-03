import { motion } from 'framer-motion';
import { useState } from 'react';

const Input = ({ label, type = "text", name, value, onChange, placeholder, required = false, error, icon: Icon }) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value && value.length > 0;
  const showFloating = isFocused || hasValue;

  return (
    <div className="mb-6">
      <div className="relative">
        
        {/* Icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Floating Label */}
        {label && (
          <motion.label
            initial={false}
            animate={{
              y: showFloating ? -26 : 0,
              scale: showFloating ? 0.85 : 1,
            }}
            className={`absolute z-10 px-1 pointer-events-none transition-colors ${
              showFloating
                ? 'text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-900'
                : 'text-gray-500 dark:text-gray-400 bg-transparent'
            } ${Icon ? 'left-12' : 'left-4'}`}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </motion.label>
        )}

        {/* Input */}
        <motion.input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={showFloating ? placeholder : ''}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.01 }}
          className={`w-full py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none
            ${Icon ? 'pl-12 pr-4' : 'px-4'}
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
            }
            bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
          `}
        />

        {/* Bottom glow line */}
        <motion.div
          initial={false}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 origin-left"
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
