<script setup lang="ts">
import { ref } from 'vue'
import { sendContactEmail } from '@/lib/email'
import { db } from '@/firebase'
import { addDoc, collection, Timestamp } from 'firebase/firestore'

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const sending = ref(false)
const error = ref('')
const success = ref(false)

async function onSubmit(e: Event) {
  e.preventDefault()
  error.value = ''
  success.value = false
  sending.value = true
  try {
    await sendContactEmail({
      name: name.value,
      email: email.value,
      subject: subject.value,
      message: message.value
    })
    // Persist message for dashboard counts/history
    await addDoc(collection(db, 'messages'), {
      name: name.value,
      email: email.value,
      subject: subject.value,
      message: message.value,
      createdAt: Timestamp.now()
    })
    name.value = ''
    email.value = ''
    subject.value = ''
    message.value = ''
    success.value = true
  } catch (e: any) {
    error.value = e?.message || 'Failed to send message'
  } finally {
    sending.value = false
  }
}

const contactInfo = [
  { icon: '✉️', label: 'Email', value: 'youhokihb@gmail.com', link: '#' },
  { icon: '📞', label: 'Phone', value: '+855 86899924', link: '#' },
  { icon: '📍', label: 'Location', value: 'Phum Prek Moha Teap, Khum Svay Po, Srok Battambang, Khaet Battambang', link: '#' }
]

const socialLinks = [
  { icon: '🐙', label: 'GitHub', link: '#' },
  { icon: '💼', label: 'LinkedIn', link: '#' },
  { icon: '🐦', label: 'Twitter', link: '#' }
]
</script>

<template>
  <section id="contact" class="py-20 px-6">
    <div class="container max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold mb-6">Let's Work Together</h2>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have a project in mind? I'd love to hear about it. Let's discuss how we can bring your ideas to life.
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12">
        <div class="space-y-8">
          <div>
            <h3 class="text-2xl font-semibold mb-6">Get In Touch</h3>
            <div class="space-y-4">
              <a 
                v-for="(item, index) in contactInfo"
                :key="index"
                :href="item.link"
                class="flex items-center space-x-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors duration-200 group"
              >
                <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-accent text-primary-foreground group-hover:shadow-glow/20 transition-all duration-200">
                  <span class="text-base">{{ item.icon }}</span>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">{{ item.label }}</p>
                  <p class="font-medium">{{ item.value }}</p>
                </div>
              </a>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-4">Follow Me</h3>
            <div class="flex space-x-4">
              <a
                v-for="(social, index) in socialLinks"
                :key="index"
                :href="social.link"
                class="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary border border-border hover:bg-gradient-accent hover:text-primary-foreground transition-all duration-200 hover:shadow-glow/20"
                :aria-label="social.label"
              >
                <span class="text-base">{{ social.icon }}</span>
              </a>
            </div>
          </div>
        </div>

        <div class="p-8 bg-gradient-card border border-border rounded-lg">
          <h3 class="text-2xl font-semibold mb-6">Send Message</h3>
          <form class="space-y-6" @submit="onSubmit">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label for="name" class="block text-sm font-medium mb-2">Name</label>
                <input 
                  id="name" 
                  v-model="name"
                  placeholder="Your name" 
                  class="w-full px-3 py-2 rounded-md bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium mb-2">Email</label>
                <input 
                  id="email" 
                  v-model="email"
                  type="email" 
                  placeholder="your@email.com" 
                  class="w-full px-3 py-2 rounded-md bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            
            <div>
              <label for="subject" class="block text-sm font-medium mb-2">Subject</label>
              <input 
                id="subject" 
                v-model="subject"
                placeholder="Project inquiry" 
                class="w-full px-3 py-2 rounded-md bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            
            <div>
              <label for="message" class="block text-sm font-medium mb-2">Message</label>
              <textarea 
                id="message" 
                v-model="message"
                placeholder="Tell me about your project..." 
                rows="6"
                class="w-full px-3 py-2 rounded-md bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>
            
            <button 
              type="submit" 
              :disabled="sending"
              class="w-full px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:brightness-90 transition-all duration-300 disabled:opacity-70"
            >
              {{ sending ? 'Sending…' : 'Send Message' }}
            </button>
            <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
            <p v-if="success" class="text-sm text-green-600 text-center">Sent! I'll reply soon.</p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>

