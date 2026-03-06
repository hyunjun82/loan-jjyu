import Link from "next/link"

interface Category {
  name: string
  slug: string
  icon: string
  description: string
  count: number
}

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/products/${category.slug}`}
      className="group block p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:bg-blue-100 transition-colors">
        {category.icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
      <p className="text-sm text-gray-500">{category.description}</p>
      {category.count > 0 && (
        <span className="inline-block mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          {category.count}개 상품
        </span>
      )}
    </Link>
  )
}
