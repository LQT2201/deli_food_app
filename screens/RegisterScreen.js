import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  selectAuthLoading,
  selectAuthError,
  clearError,
} from "../slices/authSlice";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      dispatch(clearError());
      return;
    }

    if (password !== confirmPassword) {
      dispatch(clearError());
      return;
    }

    dispatch(registerUser({ name, email, password }));
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-center mb-8">Register</Text>

        {error && (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}

        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-6"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-[#00CCBB] rounded-lg p-4"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Register
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4"
          onPress={() => navigation.navigate("Login")}
        >
          <Text className="text-center text-gray-500">
            Already have an account?{" "}
            <Text className="text-[#00CCBB]">Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
