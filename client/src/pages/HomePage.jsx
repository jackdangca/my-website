
import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'


const highlights = [
  {
    title: 'Web Development',
    text: 'Building responsive React applications with clean, maintainable code.',
  },
  {
    title: 'Cloud & DevOps',
    text: 'Deploying infrastructure on Azure with Terraform and Kubernetes.',
  },
  {
    title: 'AI Applications',
    text: 'Creating conversational AI and RAG assistants with modern LLM tooling.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero section with the welcome message */}
      <section className="pb-6 pt-10 text-center">
        <div className="mb-5 flex justify-center">
          <Logo size={86} />
        </div>
        <h1 className="mb-2.5 text-4xl font-bold text-ink md:text-5xl">
          Hello, I&apos;m <span className="text-brand">Xiaoxing Dang</span>
        </h1>
        <p className="mb-4 text-lg font-semibold text-brand-dark">
          Software Engineering Student · Cloud &amp; DevOps Enthusiast
        </p>
        <p className="mx-auto mb-7 max-w-2xl text-slate-muted">
          Welcome to my personal portfolio. Here you will find my projects, education and the
          services I offer. I am currently studying Software Engineering Technology at Centennial
          College and working towards a career in cloud computing and DevOps.
        </p>

        {/* buttons redirecting to other pages */}
        <div className="flex flex-wrap justify-center gap-3.5">
          <Link
            to="/about"
            className="inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            About Me
          </Link>
          <Link
            to="/projects"
            className="inline-block rounded-full border-2 border-brand px-6 py-3 font-semibold text-brand transition hover:-translate-y-0.5 hover:bg-brand hover:text-white"
          >
            View My Projects
          </Link>
        </div>
      </section>

    
      <section className="mx-auto my-10 max-w-3xl rounded-3xl bg-gradient-to-br from-slate-900 to-teal-900 px-8 py-9 text-center text-white">
        <h2 className="mb-3 text-xl font-bold text-brand-light">My Mission</h2>
        <p className="mx-auto max-w-2xl text-slate-300">
          My mission is to build reliable, secure and user-friendly software — and to grow into a
          cloud engineer who helps organizations deploy and operate their applications with
          confidence. I believe great technology comes from careful engineering, honest teamwork
          and continuous learning.
        </p>
      </section>

      
      <section className="grid gap-5 md:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="mb-2 text-lg font-bold text-brand-dark">{item.title}</h3>
            <p className="text-sm text-slate-muted">{item.text}</p>
          </article>
        ))}
      </section>
    </>
  )
}
