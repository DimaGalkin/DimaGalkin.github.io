import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";

class Nav {
    constructor(state, prefix) {
        this.game = state;

        this.navMeshPrefix = prefix;

        this.algorithm = this.djikstrasPFA;

        this.djikstras_nodemap = {};
        this.djikstras_pathmap = {};

        this.obstacle_blacklist = [
            "OUTER_WALL",
            "OUTER_WALL.001",
            "TRUSS_WALL_LEFT",
            "TRUSS_WALL_LEFT.001",
            "TRUSS_WALL_RIGHT",
            "TRUSS_WALL_RIGHT.001",
            "FRONT_OUTER_WALL",
            "FRONT_OUTER_WALL.001",
            "BACK_OUTER_WALL",
            "BACK_OUTER_WALL.001",
        ];
    }

    hasPrefix(str, prefix) {
        if (str == null || prefix == null) return false;
        return str.slice(0, prefix.length) == prefix;
    }

    suffix(str, prefix) {
        if (str == null || prefix == null) return false;
        return str.slice(prefix.length, str.length);
    }

    distance(v1, v2) {
        return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.z - v1.z, 2));
    }

    setupDPFAnodes() {
        let nodes = this.game.level.children.filter(child => this.hasPrefix(child.userData.name, this.navMeshPrefix));

        nodes.forEach(node => {
            nodes.forEach(node2 => {
                let blocked = false;

                if (node == node2) return;

                node.position.y = 0.1;
                node2.position.y = 0.1;

                let dir = node2.position.clone();
                dir.sub(node.position);

                let dist = dir.length();

                let raycaster = new THREE.Ray( node.position, dir.clone().normalize() );

                for (const obstacle of this.game.level.children) {
                    if (obstacle == null) continue;
                    if (this.hasPrefix(obstacle.userData.name, this.navMeshPrefix)) continue;
                    if (this.obstacle_blacklist.includes(obstacle.userData.name)) continue;

                    let boundingBox = new THREE.Box3().setFromObject(obstacle);
                    let point = new THREE.Vector3();
                    let intersects = raycaster.intersectBox(boundingBox, point);

                    if (intersects) {
                        let distance = point.distanceTo(node.position);
                        if (distance < dist) {
                            blocked = true;
                        }
                    }
                }

                if (!blocked) {
                    let suffix = this.suffix(node.userData.name, this.navMeshPrefix);
                    let distance = this.distance(node.position, node2.position);

                    if (this.djikstras_nodemap[suffix] == null) {
                        this.djikstras_nodemap[suffix] = [];
                    }

                    let destination = this.suffix(node2.userData.name, this.navMeshPrefix);

                    let child = {
                        id: destination,
                        distance: distance
                    };

                    this.djikstras_nodemap[suffix].push(child);
                }
            });
        });
    }

    djikstrasPFA(starting_node) {
        this.dijkstras_recur(starting_node, 0, starting_node);
    }

    randomNodePFA() {
        let keys = Object.keys(this.djikstras_nodemap);
        let random = Math.floor(Math.random() * keys.length);
        return keys[random];
    }

    closestNodeTo(pos) {
        let closest = null;
        let closest_distance = null;

        for (const node of this.game.level.children.filter(child => this.hasPrefix(child.userData.name, this.navMeshPrefix))) {
            let distance = this.distance(pos, node.position);

            if (closest_distance == null || distance < closest_distance) {
                closest = node;
                closest_distance = distance;
            }
        }

        return this.suffix(closest.userData.name, this.navMeshPrefix);
    }

    farthestNodeTo(pos) {
        let farthest = null;
        let farthest_distance = null;

        for (const node of this.game.level.children.filter(child => this.hasPrefix(child.userData.name, this.navMeshPrefix))) {
            let distance = this.distance(pos, node.position);

            if (farthest_distance == null || distance > farthest_distance) {
                farthest = node;
                farthest_distance = distance;
            }
        }

        return this.suffix(farthest.userData.name, this.navMeshPrefix);
    }

    getNqPFA(to) {
        let path = this.djikstras_pathmap[to].path;
        let nodes = path.split("->");

        return nodes;
    }

    dijkstras_recur(current_node, cost, path) {
        for (const connection of this.djikstras_nodemap[current_node]) {
            let new_cost = cost + connection.distance;
            let new_path = path + "->" + connection.id;

            if (this.djikstras_pathmap[connection.id] == null || new_cost < this.djikstras_pathmap[connection.id].cost) {
                this.djikstras_pathmap[connection.id] = {
                    cost: new_cost,
                    path: new_path
                };

                this.dijkstras_recur(connection.id, new_cost, new_path);
            }
        }
    }
};

export default Nav;