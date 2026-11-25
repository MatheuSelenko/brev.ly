import { Link } from 'react-router'
import notFoundImage from '../assets/404.svg'

export function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-3">
      <div className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded-lg bg-gray-100 px-5 py-12 text-center lg:px-12 lg:py-16">
        <img src={notFoundImage} alt="404" className="h-[72px] lg:h-[85px]" />

        <h1 className="text-xl">Link não encontrado</h1>

        <p className="text-md text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.
          Saiba mais em{' '}
          <Link to="/" className="text-blue-base underline">
            brev.ly
          </Link>
          .
        </p>
      </div>
    </main>
  )
}