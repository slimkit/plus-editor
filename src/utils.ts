interface generateImageWithTextOptions {
  /** 画布宽度 */
  width: number
  /** 画布高度 */
  height: number
}

/**
 * 图片添加水印
 *
 * @param imageSrc 原图片src地址
 * @param text 需要添加的文字
 */
export async function generateImageWithText(
  imageSrc: string,
  text: string,
  options: Partial<generateImageWithTextOptions> = {},
): Promise<string> {
  const canvasDom = document.createElement('canvas')
  canvasDom.width = options.width || 100
  canvasDom.height = options.height || 100
  const ctx = canvasDom.getContext('2d')!

  const image = document.createElement('img')
  await new Promise(resolve => {
    image.onload = resolve
    image.src = imageSrc
  })

  ctx.drawImage(image, 0, 0, canvasDom.width, canvasDom.height)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  ctx.fillRect(0, 0, canvasDom.width, canvasDom.height)

  ctx.textBaseline = 'top'
  ctx.fillStyle = '#fff'
  ctx.fillText(text, 25, 45)

  const base64 = canvasDom.toDataURL('image/png')
  canvasDom.remove()
  return base64
}
