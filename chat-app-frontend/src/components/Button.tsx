import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = ({ onClick, children, ...rest }) => {
    return (
        <button className="bg-transparent border border-[#6b4eff] text-[#6b4eff] px-2.5 py-1 rounded-full cursor-pointer mt-1.5 font-roboto hover:bg-[#6b4eff] hover:text-white" onClick={onClick} {...rest}>
            {children}
        </button>

    );
}

export default Button;