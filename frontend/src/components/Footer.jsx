import { Container } from '@/components/Container'
import { Logomark } from '@/components/Logo'
import { BsGithub } from 'react-icons/bs'


export function Footer() {

  return (
    <footer className="border-t border-gray-200">
      <Container>
        <div className="flex flex-col items-start justify-between gap-y-12 pt-16 pb-6 lg:flex-row lg:items-center lg:py-16">
          <div>
            <div className="flex items-center text-gray-900">
              <Logomark className="h-10 w-10 flex-none fill-cyan-600" />
              <div className="ml-4">
                <p className="text-base font-semibold">ChainFlow</p>
                <p className="mt-1 text-sm">Cross Chain Fund Transfer Accelerator</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center pt-5 pb-5 md:flex-row-reverse md:justify-between md:pt-6">
            <div class="flex justify-center space-x-3 text-gray-700">
            <a href="https://github.com/RaveenaBhasin/router-iDappathon-hack" role="button"><BsGithub size={30}/></a>
          </div>
        </div>
        </div>
      </Container>
    </footer>
  )
}
