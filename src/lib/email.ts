import emailjs from '@emailjs/browser'

export type ContactPayload = {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactEmail(payload: ContactPayload): Promise<void> {
  const serviceId = (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID as string
  const templateId = (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID as string
  const publicKey = (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY as string
  if (!serviceId || !templateId || !publicKey) throw new Error('EmailJS not configured')
  await emailjs.send(serviceId, templateId, payload, { publicKey })
}


