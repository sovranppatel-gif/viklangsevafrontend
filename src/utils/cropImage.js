function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => reject(new Error('Could not load image for crop.')))
    image.src = src
  })
}

export async function getCroppedImageFile(imageSrc, pixelCrop, originalFile) {
  const image = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Could not crop image.')
  }

  const width = Math.max(1, Math.round(pixelCrop.width))
  const height = Math.max(1, Math.round(pixelCrop.height))
  canvas.width = width
  canvas.height = height

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, width, height)

  const type = ['image/jpeg', 'image/png', 'image/webp'].includes(originalFile.type)
    ? originalFile.type
    : 'image/jpeg'

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error('Could not crop image.'))
          return
        }
        resolve(result)
      },
      type,
      0.92,
    )
  })

  const ext = type === 'image/png' ? '.png' : type === 'image/webp' ? '.webp' : '.jpg'
  const baseName = String(originalFile.name || 'image').replace(/\.[^.]+$/, '')
  return new File([blob], `${baseName}-cropped${ext}`, { type, lastModified: Date.now() })
}
