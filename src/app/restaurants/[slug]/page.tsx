import { notFound } from "next/navigation";
import { RestaurantDetail } from "@/components/restaurant/RestaurantDetail";
import { restaurantRepository } from "@/lib/data";
import { restaurants } from "@/lib/data/restaurants";

export function generateStaticParams() {
  return restaurants.map((restaurant) => ({ slug: restaurant.slug }));
}

export async function generateMetadata({ params }: PageProps<"/restaurants/[slug]">) {
  const { slug } = await params;
  const restaurant = await restaurantRepository.bySlug(slug);
  if (!restaurant) return { title: "Restaurant not found · Grub Box" };

  return {
    title: `${restaurant.name} · Grub Box`,
    description: `${restaurant.cuisine} · ${restaurant.deliveryTime} delivery to ${restaurant.address}.`,
  };
}

export default async function RestaurantDetailPage({
  params,
}: PageProps<"/restaurants/[slug]">) {
  const { slug } = await params;
  const restaurant = await restaurantRepository.bySlug(slug);

  if (!restaurant) notFound();

  return <RestaurantDetail restaurant={restaurant} />;
}
