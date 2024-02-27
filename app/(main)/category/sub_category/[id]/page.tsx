import SubCategoryList from "@/components/sub_category/list";

export default function SubCategories({
  params,
}: {
  params: {
    id: number;
  };
}) {
  return <SubCategoryList id_category={params.id} />;
}
