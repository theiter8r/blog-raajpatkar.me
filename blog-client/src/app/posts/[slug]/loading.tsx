import { PostPageSkeleton } from '@/components/Skeletons';

export default function PostLoading() {
  return (
    <div className="animate-fade-in">
      <PostPageSkeleton />
    </div>
  );
}
