<script setup lang="ts">
const experiences = [
  {
    title: 'Senior Frontend Developer',
    company: 'Tech Innovators Inc.',
    period: '2022 - Present',
    description: 'Leading frontend development for cutting-edge web applications using Vuejs, TypeScript, and modern UI frameworks.'
  },
  {
    title: 'UI/UX Designer',
    company: 'Creative Studios',
    period: '2020 - 2022',
    description: 'Designed user-centered interfaces for mobile and web applications, focusing on accessibility and user experience.'
  },
  {
    title: 'Full Stack Developer',
    company: 'StartUp Labs',
    period: '2018 - 2020',
    description: 'Built scalable web applications from concept to deployment, working with diverse technology stacks.'
  }
]
</script>

<template>
  <section id="about" class="py-20 px-6 bg-secondary/30">
    <div class="container max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold mb-6">About Me</h2>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
          Passionate about creating digital experiences that make a difference. With over 5 years of experience in web development and design, I bring ideas to life through clean code and thoughtful design.
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <div class="space-y-6">
          <h3 class="text-2xl font-semibold mb-4">My Journey</h3>
          <p class="text-muted-foreground leading-relaxed">
            I started my career as a designer, fascinated by the intersection of aesthetics and functionality. Over time, I evolved into a full-stack developer, always maintaining my design-first approach to problem-solving.
          </p>
          <p class="text-muted-foreground leading-relaxed">
            Today, I specialize in creating responsive, accessible, and performant web applications. I believe in the power of good design to solve complex problems and enhance user experiences.
          </p>
          <p class="text-muted-foreground leading-relaxed">
            When I'm not coding, you'll find me exploring new design trends, contributing to open-source projects, or capturing moments through photography.
          </p>
        </div>

        <div class="space-y-4">
          <h3 class="text-2xl font-semibold mb-6">Experience</h3>
          <div v-for="(exp, index) in experiences" :key="index" class="p-6 bg-gradient-card border border-border rounded-lg hover:shadow-lg transition-all duration-300">
            <div class="space-y-2">
              <div class="flex justify-between items-start mb-2">
                <h4 class="text-lg font-semibold">{{ exp.title }}</h4>
                <span class="text-sm text-muted-foreground">{{ exp.period }}</span>
              </div>
              <p class="text-foreground font-medium">{{ exp.company }}</p>
              <p class="text-muted-foreground text-sm leading-relaxed">{{ exp.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>

