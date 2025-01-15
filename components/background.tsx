import Image from 'next/image'

interface BackgroundProps {
  fadeOut: boolean
}

export default function Background({ fadeOut }: BackgroundProps) {
  return (
    <div className="relative w-full h-full select-none">
      <div className="relative w-full h-full">
        <Image
          src="https://i.postimg.cc/wMCTdfTN/image.jpg"
          alt="Morpholution background"
          fill
          sizes="(max-width: 768px) 80vw, 80vw"
          className={`object-contain transition-opacity duration-1000 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          } pointer-events-none`}
          style={{ userSelect: 'none' }}
          draggable="false"
        />
      </div>
    </div>
  )
}

