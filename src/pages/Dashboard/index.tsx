import React, {useState, useEffect} from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import {FoodsContainer} from "./styles";

function Dashboard() {
  const [foods, setFoods] = useState<FoodTypes[]>([]);
  const [editingFood, setEditingFood] = useState<any>({});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  interface FoodTypes {
    id: number;
    name: string;
    description: string;
    price: number;
    available: boolean;
    image: string;
  }

  const getFoods = async () => {
    const response = await api.get("/foods");

    setFoods(response.data);
  };

  useEffect(() => {
    getFoods();
  }, []);

  const handleEditFood = (food: FoodTypes) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  const handleUpdateFood = async (food: FoodTypes) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddFood = async (food: FoodTypes) => {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
