import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Search, MessageSquare, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SkillSwap</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Exchange Skills, Build Connections</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with others to share your expertise and learn new skills. Trade knowledge, build relationships, and
            grow together in our community.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Start Swapping
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Browse Skills
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Create Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  List your skills and what you want to learn. Set your availability and preferences.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Find Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Browse and search for people with skills you need, or who want what you offer.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Make Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Send swap requests and negotiate the details of your skill exchange.</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>Rate & Review</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  After completing a swap, rate your experience and build your reputation.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4">SkillSwap</h4>
            <p className="text-gray-400">Building communities through skill sharing</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
