
import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-ink md:text-4xl">About Me</h1>
      <p className="mb-10 max-w-2xl text-slate-muted">
        A short introduction to who I am and what I care about.
      </p>

      <section className="grid items-start gap-10 md:grid-cols-[300px_1fr]">
       
        <div>
          <img
            src="/images/avatar.svg"
            alt="Head and shoulders portrait placeholder of Xiaoxing Dang"
            className="w-full rounded-2xl border border-slate-line shadow-md"
          />
          <p className="mt-2.5 text-center text-xs text-slate-muted">
            Photo placeholder 
          </p>
        </div>

      
        <div>
          <h2 className="text-3xl font-bold text-ink">Xiaoxing Dang</h2>
          <p className="mb-4 font-semibold text-brand-dark">
            Software Engineering Technology Student · Toronto, Canada
          </p>

          <p className="mb-3.5">
            I am a software engineering student at Centennial College with a strong interest in
            cloud computing, DevOps and web development. My studies focus on building reliable
            software — from database design and object-oriented programming to modern React
            applications.
          </p>
          <p className="mb-3.5">
            I enjoy turning practical problems into working solutions: automating cloud
            operations, designing secure infrastructure with Terraform and Kubernetes, and
            building conversational AI applications. I am currently working towards my Azure
            developer certification and looking for co-op and internship opportunities in the
            CloudOps and DevOps space.
          </p>

         
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              className="inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
              href="/resume/Xiaoxing-Dang-Resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Download Resume (PDF)
            </a>
            <Link
              to="/contact"
              className="inline-block rounded-full border-2 border-brand px-6 py-3 font-semibold text-brand transition hover:-translate-y-0.5 hover:bg-brand hover:text-white"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
