export default function TermosUso() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
          <p className="mb-4">
            Ao criar uma conta ou fazer uma compra na NSR E-commerce, você concorda 
            com estes Termos de Uso e nossa Política de Privacidade.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Cadastro e Conta</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Você deve fornecer informações verdadeiras e atualizadas</li>
            <li>Você é responsável pela segurança de sua senha</li>
            <li>Não compartilhe sua conta com terceiros</li>
            <li>Notifique-nos imediatamente sobre uso não autorizado</li>
            <li>Você deve ter pelo menos 18 anos ou ter autorização de um responsável</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Compras e Pagamentos</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Todos os preços estão em Reais (BRL) e incluem impostos quando aplicável</li>
            <li>Reservamos o direito de recusar ou cancelar pedidos</li>
            <li>Confirmação de pedido não garante disponibilidade do produto</li>
            <li>Pagamento processado por gateways seguros de terceiros</li>
            <li>Você é responsável por fornecer informações de pagamento válidas</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Preços e Disponibilidade</h2>
          <p className="mb-4">
            Fazemos todos os esforços para garantir que os preços e descrições dos produtos 
            sejam precisos. No entanto, erros podem ocorrer. Se um produto for listado com 
            preço incorreto, reservamos o direito de recusar ou cancelar pedidos desse produto.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Entrega</h2>
          <p className="mb-4">
            Prazos de entrega são estimativas e podem variar. Não nos responsabilizamos 
            por atrasos causados por transportadoras ou eventos fora de nosso controle 
            (greves, condições climáticas, etc.).
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>A entrega é feita no endereço fornecido no pedido</li>
            <li>É necessário que alguém esteja presente para receber o pedido</li>
            <li>Verifique o produto no momento da entrega</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Trocas e Devoluções</h2>
          <p className="mb-4">
            Conforme Código de Defesa do Consumidor (Art. 49), você tem 7 dias corridos 
            a partir do recebimento do produto para desistir da compra (direito de arrependimento).
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Produtos devem estar sem uso, com etiquetas e embalagem original</li>
            <li>O frete de devolução por arrependimento é de responsabilidade do cliente</li>
            <li>Produtos com defeito: entre em contato conosco para troca ou reembolso</li>
            <li>Reembolso será processado em até 10 dias úteis após recebermos o produto</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Propriedade Intelectual</h2>
          <p className="mb-4">
            Todo conteúdo do site (textos, imagens, logos, código, design) é propriedade 
            da NSR E-commerce ou de seus licenciadores e protegido por leis de direitos autorais.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Você não pode copiar, reproduzir ou distribuir nosso conteúdo</li>
            <li>Você não pode usar nosso nome ou marca sem autorização</li>
            <li>Violações serão tratadas conforme a lei</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Uso Proibido</h2>
          <p className="mb-4">Você concorda em NÃO:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Usar o site para fins ilegais ou fraudulentos</li>
            <li>Tentar acessar áreas restritas do sistema</li>
            <li>Interferir com a segurança ou funcionalidade do site</li>
            <li>Usar bots, scrapers ou ferramentas automatizadas sem autorização</li>
            <li>Fazer engenharia reversa do código do site</li>
            <li>Enviar spam ou conteúdo malicioso</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Limitação de Responsabilidade</h2>
          <p className="mb-4">
            A NSR E-commerce não se responsabiliza por:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Danos indiretos, lucros cessantes ou danos especiais</li>
            <li>Uso inadequado dos produtos adquiridos</li>
            <li>Problemas causados por informações incorretas fornecidas por você</li>
            <li>Falhas em serviços de terceiros (transportadoras, gateways de pagamento)</li>
            <li>Interrupções temporárias do site para manutenção</li>
          </ul>
          <p className="mb-4">
            Nossa responsabilidade está limitada ao valor pago pelo produto em questão.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Garantia de Produtos</h2>
          <p className="mb-4">
            Os produtos vendidos possuem garantia conforme especificado pelo fabricante 
            e pela legislação brasileira (Código de Defesa do Consumidor).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Cancelamento de Conta</h2>
          <p className="mb-4">
            Você pode solicitar o cancelamento de sua conta a qualquer momento. 
            Reservamos o direito de suspender ou cancelar contas que violem estes termos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Modificações</h2>
          <p className="mb-4">
            Reservamos o direito de modificar estes termos a qualquer momento. 
            Mudanças significativas serão notificadas por email. O uso continuado 
            do site após as alterações constitui aceitação dos novos termos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Lei Aplicável e Foro</h2>
          <p className="mb-4">
            Estes termos são regidos pelas leis da República Federativa do Brasil. 
            Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer 
            controvérsias decorrentes destes termos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Contato</h2>
          <p className="mb-4">Para dúvidas sobre estes termos:</p>
          <ul className="list-none mb-4">
            <li><strong>Email:</strong> <a href="mailto:contato@nsr.com" className="text-blue-600 hover:underline">contato@nsr.com</a></li>
            <li><strong>Suporte:</strong> <a href="mailto:suporte@nsr.com" className="text-blue-600 hover:underline">suporte@nsr.com</a></li>
          </ul>
        </section>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-8">
          <p className="font-semibold mb-2">⚠️ Importante</p>
          <p>
            Ao criar uma conta ou fazer uma compra, você declara ter lido, 
            compreendido e concordado com estes Termos de Uso e nossa Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}
