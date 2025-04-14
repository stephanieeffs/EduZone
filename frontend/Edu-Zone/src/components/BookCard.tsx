import { motion } from "framer-motion";
import { ImageWithFallback } from "../lib/image-utils";

interface BookCardProps {
  imageSrc: string;
  delay?: number;
  scale?: number;
  rotation?: number;
}

const BookCard = ({
  imageSrc,
  delay = 0,
  scale = 1,
  rotation = 0,
}: BookCardProps) => {
  return (
    <motion.div
      className="book-card relative max-w-[200px] rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
      style={{
        transform: `rotate(${rotation}deg) scale(${scale})`,
      }}
    >
      <ImageWithFallback
        src={imageSrc}
        alt="Book cover"
        className="w-full h-auto object-cover"
      />
    </motion.div>
  );
};

export default BookCard;
