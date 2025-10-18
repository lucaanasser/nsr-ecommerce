export default function PoliticaPrivacidade() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
          <p className="mb-4">
            A NSR E-commerce ("nós", "nosso" ou "empresa") está comprometida em 
            proteger sua privacidade. Esta Política de Privacidade explica como 
            coletamos, usamos, compartilhamos e protegemos suas informações pessoais 
            em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Dados Coletados</h2>
          
          <h3 className="text-xl font-semibold mb-2">2.1 Dados Fornecidos por Você</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Nome completo:</strong> para identificação e entrega</li>
            <li><strong>Email:</strong> para comunicação sobre pedidos e login</li>
            <li><strong>Telefone:</strong> para contato sobre entregas</li>
            <li><strong>CPF:</strong> apenas quando necessário para emissão de nota fiscal (opcional)</li>
            <li><strong>Endereço:</strong> para entrega de produtos</li>
            <li><strong>Senha:</strong> armazenada de forma criptografada (bcrypt)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">2.2 Dados Coletados Automaticamente</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Endereço IP:</strong> para segurança e prevenção de fraudes</li>
            <li><strong>Navegador e dispositivo:</strong> para melhorar a experiência</li>
            <li><strong>Histórico de compras:</strong> para garantias e recomendações</li>
            <li><strong>Carrinho de compras:</strong> para recuperação de compras abandonadas</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Base Legal (LGPD)</h2>
          <p className="mb-4">Coletamos e processamos seus dados pessoais com base nas seguintes hipóteses legais:</p>
          
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Execução de contrato</strong> (Art. 7º, V): dados necessários para processar e entregar seu pedido</li>
            <li><strong>Consentimento</strong> (Art. 7º, I): marketing, cookies não essenciais</li>
            <li><strong>Legítimo interesse</strong> (Art. 7º, IX): prevenção de fraudes, segurança</li>
            <li><strong>Cumprimento de obrigação legal</strong> (Art. 7º, II): notas fiscais, registros contábeis</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Uso dos Dados</h2>
          <p className="mb-4">Utilizamos seus dados para:</p>
          
          <ul className="list-disc pl-6 mb-4">
            <li>Processar e entregar seus pedidos</li>
            <li>Enviar comunicações sobre status de pedidos</li>
            <li>Fornecer suporte ao cliente</li>
            <li>Prevenir fraudes e garantir segurança</li>
            <li>Cumprir obrigações legais e fiscais</li>
            <li>Melhorar nossos produtos e serviços</li>
            <li>Enviar ofertas de marketing (apenas com seu consentimento)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Compartilhamento de Dados</h2>
          <p className="mb-4">Seus dados podem ser compartilhados com:</p>
          
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Transportadoras:</strong> nome, telefone e endereço para entrega</li>
            <li><strong>Gateways de pagamento:</strong> dados necessários para processar pagamento</li>
            <li><strong>Serviços de email:</strong> para envio de notificações transacionais</li>
            <li><strong>Autoridades:</strong> quando exigido por lei</li>
          </ul>
          
          <p className="font-semibold text-red-600 mb-4">❌ NÃO vendemos seus dados para terceiros.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos (LGPD)</h2>
          <p className="mb-4">Você tem os seguintes direitos sobre seus dados:</p>
          
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Confirmação e acesso:</strong> saber se processamos seus dados</li>
            <li><strong>Correção:</strong> atualizar dados incompletos ou incorretos</li>
            <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado</li>
            <li><strong>Eliminação:</strong> solicitar exclusão de dados não mais necessários</li>
            <li><strong>Revogação de consentimento:</strong> retirar consentimento a qualquer momento</li>
            <li><strong>Informação sobre compartilhamento:</strong> saber com quem compartilhamos</li>
            <li><strong>Oposição:</strong> opor-se ao tratamento em certas circunstâncias</li>
          </ul>
          
          <p className="mt-4">
            Para exercer seus direitos, entre em contato: <a href="mailto:privacidade@nsr.com" className="text-blue-600 hover:underline">privacidade@nsr.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Retenção de Dados</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Dados cadastrais:</strong> enquanto sua conta estiver ativa</li>
            <li><strong>Histórico de pedidos:</strong> 5 anos (prazo legal fiscal)</li>
            <li><strong>Carrinho abandonado:</strong> 90 dias</li>
            <li><strong>Logs de acesso:</strong> 6 meses</li>
          </ul>
          
          <p className="mb-4">Após inatividade de 3 anos, enviaremos notificação para reativar ou deletar sua conta.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Segurança</h2>
          <p className="mb-4">Implementamos medidas técnicas e organizacionais:</p>
          
          <ul className="list-disc pl-6 mb-4">
            <li>Criptografia de senhas (bcrypt com 12 salt rounds)</li>
            <li>Comunicação via HTTPS</li>
            <li>Tokens JWT com expiração curta (15 minutos)</li>
            <li>Validação forte de senhas (OWASP)</li>
            <li>Logs de auditoria para rastreabilidade</li>
            <li>Backups regulares criptografados</li>
            <li>Mascaramento de dados sensíveis (CPF)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Cookies</h2>
          <p className="mb-4">
            Utilizamos cookies essenciais para funcionamento do site (autenticação, carrinho de compras). 
            Cookies de análise e marketing apenas são utilizados com seu consentimento.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Alterações</h2>
          <p className="mb-4">
            Esta política pode ser atualizada. Notificaremos sobre mudanças significativas 
            por email e solicitaremos novo consentimento quando necessário.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contato - Encarregado de Dados (DPO)</h2>
          <p className="mb-4">Para questões sobre privacidade e LGPD:</p>
          <ul className="list-none mb-4">
            <li><strong>Email:</strong> <a href="mailto:dpo@nsr.com" className="text-blue-600 hover:underline">dpo@nsr.com</a></li>
            <li><strong>Email alternativo:</strong> <a href="mailto:privacidade@nsr.com" className="text-blue-600 hover:underline">privacidade@nsr.com</a></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Autoridade Nacional de Proteção de Dados (ANPD)</h2>
          <p className="mb-4">
            Você pode apresentar reclamações à ANPD em:{' '}
            <a href="https://www.gov.br/anpd" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              www.gov.br/anpd
            </a>
          </p>
        </section>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
          <p className="font-semibold mb-2">📧 Dúvidas sobre esta política?</p>
          <p>
            Entre em contato conosco em{' '}
            <a href="mailto:privacidade@nsr.com" className="text-blue-600 hover:underline">
              privacidade@nsr.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
