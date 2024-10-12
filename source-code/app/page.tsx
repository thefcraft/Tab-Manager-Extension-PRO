import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, Link, Zap, Clock, Search, Shield } from "lucide-react"
import { ReactNode } from "react"

function FeatureCard({ icon, title, description }: {icon:ReactNode, title: string, description: string}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Layers className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold text-primary">WorkflowURL</span>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#features" className="text-gray-600 hover:text-primary">Features</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-primary">Pricing</a></li>
              <li><a href="#contact" className="text-gray-600 hover:text-primary">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-b from-white to-gray-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Streamline Your Workflow with Organized URLs
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Boost your productivity by effortlessly managing and accessing your important web resources in one place.
            </p>
            <Button size="lg" className="mr-4">Get Started</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Link className="h-10 w-10 text-primary" />}
                title="URL Management"
                description="Easily organize and categorize your URLs into custom workflows for quick access."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="One-Click Access"
                description="Open all URLs in a workflow with a single click, saving you valuable time."
              />
              <FeatureCard
                icon={<Clock className="h-10 w-10 text-primary" />}
                title="Workflow Automation"
                description="Schedule URL openings and integrate with your calendar for synchronized productivity."
              />
              <FeatureCard
                icon={<Search className="h-10 w-10 text-primary" />}
                title="Powerful Search"
                description="Quickly find specific URLs or workflows with our advanced search functionality."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-primary" />}
                title="Secure & Private"
                description="Your data is encrypted and stored securely, ensuring your privacy at all times."
              />
              <FeatureCard
                icon={<Layers className="h-10 w-10 text-primary" />}
                title="Customizable Interface"
                description="Personalize your experience with customizable themes and layouts."
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Boost Your Productivity?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have streamlined their workflow with WorkflowURL.
            </p>
            <Button size="lg">Start Your Free Trial</Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">WorkflowURL</h3>
              <p className="text-gray-400">Streamline your workflow with organized URLs</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2023 WorkflowURL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
