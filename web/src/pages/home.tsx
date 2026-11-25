import logo from '../assets/logo.svg'
import { LinksList } from '../components/links-list'
import { NewLinkForm } from '../components/new-link-form'

export function Home() {
  return (
    <main className="mx-auto flex h-dvh w-full max-w-[980px] flex-col gap-6 px-3 py-8 lg:h-auto lg:min-h-dvh lg:gap-8 lg:px-0 lg:pt-[88px]">
      <img src={logo} alt="brev.ly" className="h-6 shrink-0 self-center lg:self-start" />

      <div className="flex min-h-0 flex-col gap-3 lg:flex-row lg:items-start lg:gap-5">
        <NewLinkForm />
        <LinksList />
      </div>
    </main>
  )
}