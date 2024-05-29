import Header from "@/shared/Layout/header";
import HomeScreen from "@/screens/HomeScreen";

const Page = () => {
  return (
    <div>
      <Header showItems={false} />
      <HomeScreen />
    </div>
  );
};

export default Page;
