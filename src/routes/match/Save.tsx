import { Button, Stack, Title } from "@mantine/core";
import { FC } from "react";
import { Link } from "react-router-dom";
import { useActiveMatch } from "../../stores/match/activeMatch";
import { useMatchDB } from "../../stores/match/matchDB";

export const Save: FC = () => {
    const pushToDB = useMatchDB((state) => state.push);
    const saveActiveMatch = useActiveMatch((state) => state.save);
    const resetActiveMatch = useActiveMatch((state) => state.clear);

    return (
        <Stack>
            <Title align="center">Save</Title>

            <Link to={"/match/meta"} style={{ all: "unset" }}>
                <Button
                    fullWidth
                    onClick={() => {
                        pushToDB(saveActiveMatch());

                        resetActiveMatch();
                    }}
                    my={4}
                >
                    Save and Reset
                </Button>
            </Link>

            <Link to={"/"} style={{ all: "unset" }}>
                <Button
                    fullWidth
                    onClick={() => {
                        pushToDB(saveActiveMatch());

                        resetActiveMatch();
                    }}
                    my={4}
                >
                    Save and Go Home
                </Button>
            </Link>
        </Stack>
    );
};
