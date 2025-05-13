

import { View, Text, ScrollView } from "react-native";
import RecipeesCard from "@/components/RecipeesCard";

export default function IndexScreen() {


  return (
    <ScrollView>
     <RecipeesCard></RecipeesCard>
    </ScrollView>
  );
}