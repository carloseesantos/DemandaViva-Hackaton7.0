export function DemoSeal({ children }: { children?: string }) {
  return (
    <p className="dv-demo-seal">
      {children ?? 'DEMONSTRAÇÃO • DADOS FICTÍCIOS'}
    </p>
  );
}
