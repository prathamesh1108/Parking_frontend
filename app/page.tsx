import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car, MapPin, Calendar, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Car className="h-6 w-6" />
            <span>ParkingApp</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center px-4 text-center md:px-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Smart Parking Management</h1>
            <p className="mt-6 max-w-3xl text-xl text-muted-foreground">
              Easily reserve parking spaces, track your vehicle location, and manage your parking experience with our
              intuitive platform.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/dashboard/demo">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-muted/50">
          <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Reservations</h3>
                <p className="text-muted-foreground">Book parking spaces in advance with just a few clicks.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Vehicle Tracking</h3>
                <p className="text-muted-foreground">Save and track the location of your parked vehicle.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Management</h3>
                <p className="text-muted-foreground">Robust user management and secure payment processing.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="ParkingApp dashboard preview"
                  className="rounded-lg shadow-md max-w-full h-auto"
                />
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Create an account</h3>
                    <p className="text-muted-foreground">
                      Sign up and set up your profile with your vehicle information.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Find and reserve a spot</h3>
                    <p className="text-muted-foreground">Browse available parking spaces and book in advance.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Park and save location</h3>
                    <p className="text-muted-foreground">
                      Use the app to record where you parked for easy retrieval later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-muted/50">
          <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col p-6 bg-background rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Basic</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Up to 5 reservations/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Basic vehicle tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Email support</span>
                  </li>
                </ul>
                <Button variant="outline">Get Started</Button>
              </div>

              <div className="flex flex-col p-6 bg-primary text-primary-foreground rounded-lg shadow-md relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary px-4 py-1 rounded-full text-sm font-medium">
                  Popular
                </div>
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span>/month</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited reservations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced vehicle tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Reservation history</span>
                  </li>
                </ul>
                <Button variant="secondary">Get Started</Button>
              </div>

              <div className="flex flex-col p-6 bg-background rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$29.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All Pro features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Multiple vehicles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <Button variant="outline">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-10">
        <div className="mx-auto flex w-full max-w-screen-xl flex-col md:flex-row justify-between items-center gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold">
            <Car className="h-5 w-5" />
            <span>ParkingApp</span>
          </div>
          <div className="text-center md:text-right text-sm text-muted-foreground">
            <p>© 2024 ParkingApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

