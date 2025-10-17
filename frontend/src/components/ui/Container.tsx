import { ReactNode } from 'react';

/**
 * Container Component
 * 
 * Container responsivo padronizado com espaçamento customizável
 */
interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`container-custom ${className}`}>
      {children}
    </div>
  );
}
