import { Hero } from '@/components/Hero';
import { BentoGrid } from '@/components/BentoGrid';
import { CategoryShowcase } from '@/components/CategoryShowcase';
import { ProductionShowcase } from '@/components/ProductionShowcase';
import { EventPicks } from '@/components/EventPicks';

export default function Home() {
    return (
        <main>
            <Hero />
            <EventPicks />
            <BentoGrid />
            <div id="collection">
                <CategoryShowcase />
            </div>
            <ProductionShowcase />
        </main>
    );
}

