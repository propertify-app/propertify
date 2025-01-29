'use client'

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rental } from '@/db/schema/rentals';

interface RentalCardProps {
  rental: Rental;
}

export default function RentalCard({ rental }: RentalCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* <Image
        src={rental.image}
        alt={rental.name}
        width={300}
        height={200}
        className="w-full object-cover h-48"
      /> */}
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">{rental.name}</h2>
        <p className="text-gray-600 mb-2">{rental.description}</p>
        <p className="text-lg font-bold">$540/night</p>
        <p className="text-sm text-gray-500">
          1 beds • 1 baths
        </p>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4">
        <Link href={`/manage/rentals/${rental.id}`} className="w-full">
          <Button variant="outline" className="w-full">Manage Property</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

