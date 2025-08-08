import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// This function gets called at build time
export async function getStaticProps({ params }) {
  // Fetch the property data from the JSON file
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'properties.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const properties = JSON.parse(jsonData);
  
  // Find the property with the matching ID
  const property = properties.find(p => p.id.toString() === params.id);

  // If no property is found, return 404
  if (!property) {
    return {
      notFound: true,
    };
  }

  // Pass property data to the page via props
  return {
    props: { property }
  };
}

// This function gets called at build time
export async function getStaticPaths() {
  // Fetch the property data from the JSON file
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'properties.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const properties = JSON.parse(jsonData);

  // Get the paths we want to pre-render based on properties
  const paths = properties.map((property) => ({
    params: { id: property.id.toString() },
  }));

  // Only pre-render these paths at build time
  return { 
    paths,
    fallback: false // Return 404 for non-existent properties
  };
}

export default function PropertyDetails({ property }) {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // Extract additional property details (you can add more fields to your properties.json)
  const { title, description, price, image } = property;
  
  // For now, using the same image for the gallery, but you can add more images to your properties.json
  const galleryImages = [image, image, image];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title} | Delight Homes</title>
        <meta name="description" content={description} />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-800">
            ← Back to Listings
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Property Title and Price */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-2xl font-semibold text-blue-600 mt-2">{price}</p>
        </div>

        {/* Main Image */}
        <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="rounded-lg"
          />
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {galleryImages.map((img, index) => (
            <div key={index} className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src={img}
                alt={`${title} - ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg hover:opacity-90 transition-opacity"
              />
            </div>
          ))}
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Property Details</h2>
          <p className="text-gray-700 mb-6">{description}</p>
          
          {/* Additional Details - You can add more fields as needed */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Property Type</h3>
              <p className="mt-1 text-gray-900">Apartment</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bedrooms</h3>
              <p className="mt-1 text-gray-900">2</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bathrooms</h3>
              <p className="mt-1 text-gray-900">2</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Schedule a Viewing</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                id="phone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="+256 700 123456"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="I'm interested in this property..."
                defaultValue={`I'm interested in ${title}`}
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Delight Homes Limited</h3>
              <p className="text-gray-400">Your trusted real estate partner</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link>
              <Link href="/about" className="text-gray-300 hover:text-white">About Us</Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Delight Homes Limited. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
