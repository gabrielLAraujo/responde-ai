import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";

const benefits = [
  {
    title: "Respostas em segundos",
    text: "Cole a avaliação e receba 3 opções de resposta personalizadas, no tom do seu negócio.",
  },
  {
    title: "Melhor posição no Google Maps",
    text: "Negócios que respondem avaliações transmitem mais confiança e ganham destaque nas buscas locais.",
  },
  {
    title: "Críticas tratadas com cuidado",
    text: "Para avaliações negativas, a IA reconhece o problema sem discutir e leva a conversa para o privado.",
  },
];

const plans = [
  { name: "Básico", price: "R$ 49", items: ["1 local", "Respostas com aprovação", "Histórico de respostas"] },
  {
    name: "Pro",
    price: "R$ 97",
    items: ["Tudo do Básico", "Resposta automática 4–5 estrelas", "Alerta no WhatsApp para notas baixas", "Relatório mensal"],
    highlight: true,
  },
  { name: "Agência", price: "R$ 297", items: ["Até 10 locais", "Painel multi-cliente", "Suporte prioritário"] },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Responda todas as avaliações do Google <span className="text-emerald-600">sem perder tempo</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-black/70 dark:text-white/70">
          A IA escreve respostas personalizadas para cada avaliação do seu negócio. Você só revisa e publica.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/gerar"
            className="rounded-full bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
          >
            Testar grátis agora
          </Link>
          <a href="#lista" className="rounded-full border border-black/20 px-6 py-3 font-medium dark:border-white/20">
            Entrar na lista de espera
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-16 sm:grid-cols-3">
        {benefits.map((b) => (
          <div key={b.title} className="rounded-xl border border-black/10 p-6 dark:border-white/10">
            <h2 className="font-semibold">{b.title}</h2>
            <p className="mt-2 text-sm text-black/70 dark:text-white/70">{b.text}</p>
          </div>
        ))}
      </section>

      <section className="bg-black/[.03] py-16 dark:bg-white/[.04]">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-3xl font-bold">Planos</h2>
          <p className="mt-2 text-center text-black/60 dark:text-white/60">
            Quem entrar na lista de espera ganha o primeiro mês grátis.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`rounded-xl border bg-background p-6 ${p.highlight ? "border-emerald-600 ring-2 ring-emerald-600" : "border-black/10 dark:border-white/10"}`}
              >
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-2 text-3xl font-bold">
                  {p.price}
                  <span className="text-base font-normal text-black/50 dark:text-white/50">/mês</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.items.map((i) => (
                    <li key={i}>✓ {i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lista" className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold">Seja um dos primeiros</h2>
        <p className="mt-2 mb-8 text-black/60 dark:text-white/60">
          Em breve: conexão direta com o seu Perfil da Empresa no Google, sem copiar e colar.
        </p>
        <WaitlistForm />
      </section>
    </>
  );
}
